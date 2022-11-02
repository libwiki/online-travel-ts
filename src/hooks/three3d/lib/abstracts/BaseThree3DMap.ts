import EmptyComponent from "/@/hooks/three3d/lib/abstracts/EmptyComponent";
import mitt from "mitt";
import * as Three from "three";
import {Vector2} from "three";
import {geoMercator} from "d3-geo";
import Helpers from "/@/hooks/three3d/lib/components/Helpers";
import Lights from "/@/hooks/three3d/lib/components/Lights";
import MapLayer from "/@/hooks/three3d/lib/components/MapLayer";
import {IComponent, IFeatureObject} from "/@/hooks/three3d/lib/Interfaces";
import {MapControls} from "three/examples/jsm/controls/OrbitControls";
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";
import RayCasters from "/@/hooks/three3d/lib/components/RayCasters";

export default class BaseThree3DMap extends EmptyComponent {
    el: HTMLElement
    emitter = mitt()
    scene = new Three.Scene()
    rayCasters: RayCasters;
    pointer = new Vector2(); // 鼠标经过的点
    mProjection = geoMercator()
    size = new Three.Vector3()
    _center = new Three.Vector3();
    _mapSize = new Three.Vector3();
    mapGroup = new Three.Group();
    fileLoader = new Three.FileLoader();
    textureLoader = new Three.TextureLoader()
    featureObjects: IFeatureObject[] = []
    camera: Three.Camera
    controls: MapControls
    renderer: Three.WebGLRenderer
    css3DRenderer: CSS3DRenderer
    components: IComponent[] = [ // 组件
        new MapLayer(this), // MapLayer组件为基础底图（比较特殊，必须先启动，只有地图启动了才能知道实际的center和底图mapSize）
        new Helpers(this),
        new Lights(this),
    ]

    constructor(el?: HTMLElement) {
        super()
        this.el = el || document.body
        this.setSize(window.innerWidth, window.innerHeight)
        this.mapGroup.name = 'mapGroup'
        this.camera = this.generateCamera()
        this.renderer = this.generateRenderer()
        this.css3DRenderer = this.generateCss3DRenderer()
        this.controls = this.generateControls()
        this.rayCasters = new RayCasters(this) // 射线组件（该组件在其它地方也用到故在此创建）
        this.components.push(this.rayCasters)
        // this.scene.background = new Three.Color(0xffffff)
    }

    onStart() {
        super.onStart()
        this.scene.add(this.mapGroup);
        this.components.forEach(v => v.onStart())
    }

    onReady() {
        super.onReady()
        this.components.forEach(v => v.onReady())
    }

    onUpdate() {
        requestAnimationFrame(this.onUpdate.bind(this));
        this.renderer.render(this.scene, this.camera)
        this.css3DRenderer.render(this.scene, this.camera)
        this.components.forEach(v => v.onUpdate())
        this.controls.update();
        super.onUpdate()
    }

    onDispose() {
        this.components.forEach(v => v.onDispose())
        super.onDispose()
    }

    setSize(width: number, height: number) {
        this.size.x = width
        this.size.y = height
    }

    get center() {
        return this._center
    }

    set center(val: Three.Vector3) {
        this._center = val
    }

    get mapSize() {
        return this._mapSize
    }

    set mapSize(val: Three.Vector3) {
        this._mapSize = val
        this.camera.position.z = this.maxMapAxisValue * 2
    }

    get minMapAxisValue() {
        return Math.min(this.mapSize.x, this.mapSize.y)
    }

    get maxMapAxisValue() {
        return Math.max(this.mapSize.x, this.mapSize.y)
    }

    get aspectMapRatio() {
        if (this.mapSize.y === 0) {
            return 0
        }
        return this.mapSize.x / this.mapSize.y
    }

    // 窗口宽高比
    get aspectRatio() {
        if (this.size.y === 0) {
            return 0
        }
        return this.size.x / this.size.y
    }

    /**
     * 加载纹理 （默认会忽略错误）
     * @param textureUrl
     */
    loadTexture(textureUrl: string): Three.Texture {
        return this.textureLoader.load(textureUrl)
    }

    /**
     * 加载纹理 仅当纹理加载成功时会返回，当加载失败时立即报错
     * @param textureUrl {string} 纹理路径（绝对路径）
     */
    async loadTextureAsync(textureUrl: string): Promise<Three.Texture> {
        return new Promise((resolve, reject) => {
            const texture = this.textureLoader.load(textureUrl, (t) => {
                resolve(t)
            }, (progress) => {
                // console.log('loadTexture progress', progress)
            }, (e) => {
                // console.log('loadTexture err:', e)
                reject(e)
            })
        })
    }


    generateRenderer() {
        const renderer = new Three.WebGLRenderer({
            antialias: true,     //抗锯齿
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.size.x, this.size.y);
        this.el.appendChild(renderer.domElement);
        return renderer
    }

    generateCss3DRenderer() {
        const renderer = new CSS3DRenderer();
        renderer.setSize(this.size.x, this.size.y);
        renderer.domElement.style.position = "absolute"
        renderer.domElement.style.top = "0px"
        renderer.domElement.style.top = "0px"
        renderer.domElement.style.pointerEvents = "none"
        console.log('renderer.domElement', renderer.domElement, this.size)
        this.el.appendChild(renderer.domElement)
        return renderer
    }

    generateCamera() {
        const k = this.aspectRatio
        const s = 1.6
        // const camera = new Three.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        const camera = new Three.PerspectiveCamera(45, this.aspectRatio, 0.1, 2000);
        camera.position.z = 0;
        camera.up = new Three.Vector3(0, 0, 1); // 使controls的水平旋转轴线为z轴
        return camera
    }

    generateControls() {
        const controls = new MapControls(this.camera, this.renderer.domElement);
        // const controls = new MyControls(this.camera, this.renderer.domElement);
        // const controls = new OrbitControls(camera, renderer.domElement);
        controls.minPolarAngle = 0; // 向下翻转的角度
        controls.maxPolarAngle = (Math.PI / 180) * 65; // 向上翻转的角度
        // controls.minAzimuthAngle = 0;
        // controls.maxAzimuthAngle = 0;
        // controls.enablePan = false; //  禁止平移
        controls.addEventListener('end', (e) => {
            // controls.object.up.setX(this.center.x)
            // controls.object.up.setY(this.center.y)
            // controls.object.up.setZ(this.center.z)
            // console.log(e, this.center, controls.object.up)
            // console.log(this.camera)
            // console.log(this.controls)
            // console.log(this.mapGroup)

        })
        return controls
    }

}
