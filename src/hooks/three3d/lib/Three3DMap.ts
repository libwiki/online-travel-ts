import * as Three from "three"
import {geoMercator} from "d3-geo";
import {MapControls} from "three/examples/jsm/controls/OrbitControls";
import Lights from "/@/hooks/three3d/lib/components/Lights";
import Helpers from "/@/hooks/three3d/lib/components/Helpers";
import _, {isString} from "lodash";
import {Coordinate, IGeoFeature, IGeoJson} from "/@/@types/geoJson";
import MyControls from "/@/hooks/three3d/lib/threeX/MyControls";
import {IComponent, IFeatureObject} from "/@/hooks/three3d/lib/Interfaces";
import MapLayer from "/@/hooks/three3d/lib/layers/MapLayer";

export default class Three3DMap {
    el: HTMLElement
    scene = new Three.Scene()
    mProjection = geoMercator()
    camera: Three.Camera
    controls: MapControls
    renderer: Three.WebGLRenderer
    size = new Three.Vector3()
    s = 1.6; //三维场景显示范围控制系数，系数越大，显示的范围越大
    center = new Three.Vector3();
    mapGroup = new Three.Group();
    fileLoader = new Three.FileLoader();
    textureLoader = new Three.TextureLoader()
    components: IComponent[] = []
    featureObjects: IFeatureObject[] = []

    // 窗口宽高比
    get aspectRatio() {
        return this.size.x / this.size.y
    }

    constructor(el?: HTMLElement) {
        this.el = el || document.body
        this.initSize(window.innerWidth, window.innerHeight)
        this.camera = this.generateCamera()
        this.renderer = this.generateRenderer()
        this.controls = this.generateControls()
        this.scene.add(this.mapGroup);

        this.initComponents();
        this.loadJson()
    }

    loadJson(jsonUrl: string = '/geojson/dahua/geo.json') {
        this.fileLoader.load(jsonUrl, (data: any) => {
            if (isString(data)) {
                try {
                    data = JSON.parse(data)
                } catch (e) {
                    return;
                }
            }
            const featureObjects: IFeatureObject[] = [];
            data.features.forEach((feature: IGeoFeature<any>, index: number) => {
                const properties = {
                    name: feature.properties.name,
                    city: feature.properties.city,
                    country: feature.properties.country,
                    province: feature.properties.province,
                }
                if (feature.geometry.type === 'Polygon') {
                    const geometry = this.parsePolygons([feature.geometry.coordinates], index)
                    featureObjects.push({geometry, properties})
                } else if (feature.geometry.type === 'MultiPolygon') {
                    const geometry = this.parsePolygons(feature.geometry.coordinates, index)
                    featureObjects.push({geometry, properties})
                }
            })
            this.featureObjects = featureObjects;
            new MapLayer(this).onRender()

            // 执行组件
            this.components.forEach(v => v.onUpdate())

            this.camera.position.set(this.center.x, this.center.y, this.camera.position.z); //沿着z轴观察
            this.camera.lookAt(this.center.x, this.center.y, this.center.z); //指向中国地图的几何中心
            this.controls.target.set(this.center.x, this.center.y, this.controls.target.z);
            this.controls.update();//update()函数内会执行camera.lookAt(controls.target)
        }, console.log, console.log)
    }

    initComponents() {
        this.components.push(new Helpers(this))
        this.components.push(new Lights(this))
    }

    parsePolygons(coordinates: any[], index: number) {
        const areaArr: Coordinate[][] = []
        coordinates.forEach((item) => { // 这一层如果有多个说明一个区域有多个图形组成（比如（中国的省份）有大陆、台湾、以及多个不相交的群岛组成）
            const areaItemArr: Coordinate[][] = []
            item.forEach((polygon: Coordinate[]) => { // 这一层是每一个区域地图的图形坐标
                areaItemArr.push(polygon)
            })
            areaArr.push(...areaItemArr)
        })
        return areaArr;
    }

    initSize(width: number, height: number) {
        this.size.x = width
        this.size.y = height
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


    onRender() {
        requestAnimationFrame(this.onRender.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera)
    }

}
