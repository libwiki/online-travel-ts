import EmptyComponent from "/@/hooks/three3d/lib/abstracts/EmptyComponent";
import mitt from "mitt";
import * as Three from "three";
import {BoxGeometry, Mesh, MeshPhongMaterial, Vector2} from "three";
import {geoMercator} from "d3-geo";
import Helpers from "/@/hooks/three3d/lib/components/Helpers";
import Lights from "/@/hooks/three3d/lib/components/Lights";
import MapLayer from "/@/hooks/three3d/lib/components/MapLayer";
import {IComponent, IFeatureObject, IThree3DMapDebug} from "/@/hooks/three3d/lib/Interfaces";
import {MapControls} from "three/examples/jsm/controls/OrbitControls";
import {CSS3DRenderer} from "three/examples/jsm/renderers/CSS3DRenderer";
import RayCasters from "/@/hooks/three3d/lib/components/RayCasters";
import {getCenterByBox3, getSizeByBox3} from "/@/hooks/three3d/lib/utils";
import BackgroundPlane from "/@/hooks/three3d/lib/components/BackgroundPlane";

export default class BaseThree3DMap extends EmptyComponent {
    el: HTMLElement
    _running = false // 正在启动 （false时将停止onUpdate的帧刷新）
    emitter = mitt()
    scene = new Three.Scene()
    rayCasters: RayCasters; // 射线组件（管理地图中的除了html元素之外的用户事件处理，html组件元素会独立管理事件处理）
    pointer = new Vector2(); // 当前鼠标经过的点（rayCasters组件中使用到）
    mProjection = geoMercator();
    size = new Three.Vector3(); // 渲染器大小
    centerCube = new Three.Mesh(new BoxGeometry(0, 0, 0), new Three.MeshBasicMaterial()); // 中心点的正方形（目前暂时仅用于光源的方向指向）
    _mapBox3 = new Three.Box3(); // 地图的box3盒子
    _center = new Three.Vector3(); // 地图的盒子中心点
    _mapSize = new Three.Vector3(); // 地图的盒子大小
    mapGroup = new Three.Group();
    fileLoader = new Three.FileLoader();
    textureLoader = new Three.TextureLoader()
    featureObjects: IFeatureObject[] = []; // 加载的geoJson数据
    components: IComponent[] = []; // 组件
    camera: Three.Camera
    controls: MapControls
    renderer: Three.WebGLRenderer
    css3DRenderer: CSS3DRenderer
    protected _debug: IThree3DMapDebug = {
        lightDebug: false, // 灯光调试
        gridDebug: true, // 网格调试
        axesDebug: true, // 坐标轴调试
        polarAngleDebug: false, // 上下翻转调试（开启后无死角翻转）
        enablePan: false, // 左右移动（开启后可拖动）
        castShadow: true, // 开启阴影
    }


    constructor(el?: HTMLElement) {
        super()
        this.el = el || document.body
        this.setSize(window.innerWidth, window.innerHeight)
        this.mapGroup.name = 'mapGroup'
        this.centerCube.visible = false
        this.centerCube.name = 'centerCube'
        this.camera = this.generateCamera()
        this.renderer = this.generateRenderer()
        this.css3DRenderer = this.generateCss3DRenderer()
        this.controls = this.generateControls()
        this.registerComponents()
        this.rayCasters = new RayCasters(this) // 射线组件（该组件在其它地方也用到故在此创建）
        this.components.push(this.rayCasters)
        // this.scene.background = new Three.Color(0xffffff)
    }

    // 注册默认组件
    protected registerComponents() {
        this.components.push(new MapLayer(this)) // MapLayer组件为基础底图（比较特殊，必须先启动，只有地图启动了才能知道实际的center和底图mapSize）
        this.components.push(new Helpers(this))
        this.components.push(new Lights(this))
        this.components.push(new BackgroundPlane(this))
    }

    onStart() {
        super.onStart()
        this.scene.add(this.mapGroup);
        this.scene.add(this.centerCube);
        this.components.forEach(v => v.onStart())
        this.isRunning = true
        this.onUpdate(Date.now())
    }

    onReady() {
        super.onReady()
        this.components.forEach(v => v.onReady())
    }

    onUpdate(deltaTime: number) {
        if (this.isRunning) { // 是否正在启动
            requestAnimationFrame(this.onUpdate.bind(this));
            this.renderer.render(this.scene, this.camera)
            this.css3DRenderer.render(this.scene, this.camera)
            this.components.forEach(v => v.onUpdate(deltaTime))
            this.controls.update();
            super.onUpdate(Date.now())
        }

    }

    onDispose() {
        this.components.forEach(v => v.onDispose())
        this.mapGroup.clear() // 清空地图数据
        this.featureObjects = [] // 清空加载的geoJson数据
        super.onDispose()
        requestAnimationFrame(() => { // 在下一帧时彻底停止帧刷新
            this.isRunning = false;
        })

    }

    setSize(width: number, height: number) {
        this.size.x = width
        this.size.y = height
    }

    get debug() {
        return this._debug
    }

    set debug(val: IThree3DMapDebug) {
        this._debug = {
            ...this._debug,
            ...val,
        }

    }

    get isRunning() {
        return this._running
    }

    // 正在启动 （false时将停止onUpdate的帧刷新）
    set isRunning(val: boolean) {
        const oldVal = this._running
        this._running = val
        if (val && val !== oldVal) { // 重新启动
            this.onUpdate(Date.now())
        }

    }

    get mapBox3() {
        return this._mapBox3
    }

    // 设置mapBox3时会自动设置center和mapSize
    set mapBox3(box3: Three.Box3) {
        this._mapBox3 = box3
        this.mapSize = getSizeByBox3(box3)
        this.center = getCenterByBox3(box3)

    }

    get center() {
        return this._center
    }

    set center(val: Three.Vector3) {
        this.centerCube.position.copy(val)
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
        renderer.shadowMap.enabled = this.debug.castShadow || false
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
        if (!this.debug.polarAngleDebug) { // 没有开启控制debug
            controls.minPolarAngle = 0; // 向下翻转的角度
            controls.maxPolarAngle = (Math.PI / 180) * 65; // 向上翻转的角度
        }
        // controls.minAzimuthAngle = 0;
        // controls.maxAzimuthAngle = 0;
        controls.enablePan = this.debug.enablePan || false; //  禁止平移
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
