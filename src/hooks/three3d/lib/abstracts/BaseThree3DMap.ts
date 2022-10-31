import EmptyComponent from "/@/hooks/three3d/lib/abstracts/EmptyComponent";
import mitt from "mitt";
import * as Three from "three";
import {geoMercator} from "d3-geo";
import Helpers from "/@/hooks/three3d/lib/components/Helpers";
import Lights from "/@/hooks/three3d/lib/components/Lights";
import MapLayer from "/@/hooks/three3d/lib/components/MapLayer";
import {IComponent, IFeatureObject} from "/@/hooks/three3d/lib/Interfaces";
import {MapControls} from "three/examples/jsm/controls/OrbitControls";

export default class BaseThree3DMap extends EmptyComponent {
    el: HTMLElement
    emitter = mitt()
    scene = new Three.Scene()
    mProjection = geoMercator()
    size = new Three.Vector3()
    s = 1.6; //三维场景显示范围控制系数，系数越大，显示的范围越大
    center = new Three.Vector3();
    mapGroup = new Three.Group();
    fileLoader = new Three.FileLoader();
    textureLoader = new Three.TextureLoader()
    components: IComponent[] = [ // 组件
        new Helpers(this),
        new Lights(this),
        new MapLayer(this),
    ]
    featureObjects: IFeatureObject[] = []


    camera: Three.Camera
    controls: MapControls
    renderer: Three.WebGLRenderer

    constructor(el?: HTMLElement) {
        super()
        this.el = el || document.body
        this.setSize(window.innerWidth, window.innerHeight)
        this.camera = this.generateCamera()
        this.renderer = this.generateRenderer()
        this.controls = this.generateControls()
        // this.scene.background = new Three.Color(0xffffff)
        this.components.forEach(v => v.onStart())
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
        super.onUpdate()
        requestAnimationFrame(this.onUpdate.bind(this));
        this.renderer.render(this.scene, this.camera)
        this.components.forEach(v => v.onUpdate())
        this.controls.update();
    }

    onDispose() {
        super.onDispose()
        this.components.forEach(v => v.onDispose())
    }

    setSize(width: number, height: number) {
        this.size.x = width
        this.size.y = height
    }

    // 窗口宽高比
    get aspectRatio() {
        return this.size.x / this.size.y
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

    generateCamera() {
        const k = this.aspectRatio
        const s = this.s
        // const camera = new Three.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        const camera = new Three.PerspectiveCamera(45, this.aspectRatio, 0.1, 2000);
        camera.position.z = 5;
        camera.up = new Three.Vector3(0, 0, 1); // 使controls的水平旋转轴线为z轴
        return camera
    }

    generateControls() {
        const controls = new MapControls(this.camera, this.renderer.domElement);
        // const controls = new MyControls(this.camera, this.renderer.domElement);
        // const controls = new OrbitControls(camera, renderer.domElement);
        // controls.minPolarAngle = 0; // 向下翻转的角度
        // controls.maxPolarAngle = (Math.PI / 180) * 85; // 向上翻转的角度
        // controls.minAzimuthAngle = 0;
        // controls.maxAzimuthAngle = 0;
        controls.addEventListener('end', (e) => {
            // controls.object.up.setX(this.center.x)
            // controls.object.up.setY(this.center.y)
            // controls.object.up.setZ(this.center.z)
            // console.log(e, this.center, controls.object.up)

        })
        return controls
    }

}
