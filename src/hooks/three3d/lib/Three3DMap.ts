import * as Three from "three"
import {geoMercator} from "d3-geo";
import {MapControls} from "three/examples/jsm/controls/OrbitControls";
import Lights from "/@/hooks/three3d/lib/components/Lights";
import Helpers from "/@/hooks/three3d/lib/components/Helpers";
import _, {isString} from "lodash";
import {IGeoJson} from "/@/@types/geoJson";
import {IComponent} from "/@/hooks/three3d/lib/components/IComponent";
import MyControls from "/@/hooks/three3d/lib/threeX/MyControls";

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

    loadJson() {
        this.fileLoader.load('/geojson/广西河池-大化瑶族自治县.json', (data: any) => {
            if (isString(data)) {
                try {
                    data = JSON.parse(data)
                } catch (e) {
                    return;
                }
            }
            const group = new Three.Group();
            (data as IGeoJson).features.forEach((feature: any, index: number) => {
                console.log(feature)
                if (feature.geometry.type === 'Polygon') {
                    group.add(this.parsePolygons2([feature.geometry.coordinates], index))
                    // const areaArr = this.parsePolygons([feature.geometry.coordinates], index)
                } else if (feature.geometry.type === 'MultiPolygon') {
                    group.add(this.parsePolygons2(feature.geometry.coordinates, index))
                    // const areaArr = this.parsePolygons(feature.geometry.coordinates, index)
                }
            })
            this.mapGroup.add(group)
            console.log(group)
            // 地图mapGroup的包围盒计算
            const box3 = new Three.Box3();//创建一个包围盒
            // .expandByObject()方法：计算层级模型group包围盒
            box3.expandByObject(group);
            // console.log('查看包围盒box3', box3);

            //scaleV3表示包围盒长宽高尺寸
            const scaleV3 = new Three.Vector3();
            // .getSize()计算包围盒长宽高尺寸
            box3.getSize(scaleV3)
            // 查看控制台包围盒大小，辅助设置相机参数
            console.log('查看包围盒尺寸', scaleV3);

            // .getCenter()计算一个层级模型对应包围盒的几何体中心
            box3.getCenter(this.center);
            this.mapGroup.add(this.cityPointMesh(box3))

            // 查看控制台包围盒集合中心，作为lookAt()参数
            console.log('查看几何中心', this.center);
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
        const areaArr: [number, number][] = []
        coordinates.forEach((item) => { // 这一层如果有多个说明一个区域有多个图形组成（比如（中国的省份）有大陆、台湾、以及多个不相交的群岛组成）
            const areaItemArr: [number, number][] = []
            item.forEach((polygon: any[]) => { // 这一层是每一个区域地图的图形坐标
                areaItemArr.push(...polygon)
            })
            areaArr.push(...areaItemArr)
        })
        return areaArr;
    }

    parsePolygons2(coordinates: any[], index: number) {
        const group = new Three.Group()
        coordinates.forEach((item) => {
            const shapeArr: Three.Shape[] = [];//轮廓形状Shape集合
            item.forEach((polygon: any[]) => {
                const pointArr: number[] = []
                const backPointArr: number[] = []
                const vector2Arr: Three.Vector2[] = []
                polygon.forEach((elem: [number, number]) => {
                    const v = this.mProjection(elem)
                    if (v) {
                        pointArr.push(v[0], -v[1], 0.10);
                        backPointArr.push(v[0], -v[1], 0.01);
                        vector2Arr.push(new Three.Vector2(v[0], -v[1]))
                    }
                });
                group.add(this.line(pointArr))
                // group.add(this.line(backPointArr))
                const shape = new Three.Shape(vector2Arr)
                shapeArr.push(shape);
                // // texture.wrapS = RepeatWrapping;
                // // texture.wrapT = RepeatWrapping;
                // // texture.repeat.x = 1; // 水平
                // // texture.repeat.y = 1; // 垂直
                // const material = new MeshLambertMaterial({
                //     // map: index <= 1 ? texture : null,
                //     envMap: texture,
                //     transparent: true, //使用背景透明的png贴图，注意开启透明计算
                //     // color: 0x004444,
                //     color: 0xffffff,
                //     side: DoubleSide, //两面可见
                // }); //材质对象
                // const geometry = new ExtrudeGeometry([shape], {
                //     depth: 0.1, //拉伸高度 根据行政区尺寸范围设置，比如高度设置为尺寸范围的2%，过小感觉不到高度，过大太高了
                //     bevelEnabled: false //无倒角
                // });
                // const mesh = new Mesh(geometry, material); //网格模型对象
                // group.add(mesh)
            })
            const material = new Three.MeshLambertMaterial({
                // color: 0x004444,
                color: 0xffffff,
                // side: DoubleSide, //两面可见
            }); //材质对象
            const geometry = new Three.ExtrudeGeometry(shapeArr, {
                depth: 0.1, //拉伸高度 根据行政区尺寸范围设置，比如高度设置为尺寸范围的2%，过小感觉不到高度，过大太高了
                bevelEnabled: false //无倒角
            });
            const mesh = new Three.Mesh(geometry, material); //网格模型对象
            group.add(mesh)
            // groupShapeArr.push(...shapeArr)
        })
        return group;
    }

    line(pointArr: number[], loop = true) {
        /**
         * 通过BufferGeometry构建一个几何体，传入顶点数据
         * 通过Line模型渲染几何体，连点成线
         * LineLoop和Line功能一样，区别在于首尾顶点相连，轮廓闭合
         */
        const geometry = new Three.BufferGeometry(); //创建一个Buffer类型几何体对象
        //类型数组创建顶点数据
        const vertices = new Float32Array(pointArr);
        // 创建属性缓冲区对象
        // 设置几何体attributes属性的位置属性
        geometry.attributes.position = new Three.BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
        // 线条渲染几何体顶点数据
        const material = new Three.LineBasicMaterial({
            color: 0x00cccc //线条颜色
        });//材质对象
        if (loop) {
            return new Three.Line(geometry, material);//线条模型对象
        }
        return new Three.LineLoop(geometry, material);//首尾顶点连线，轮廓闭合
    }

    cityPointMesh(box3: Three.Box3) {
        var material = new Three.MeshBasicMaterial({
            color: 0xffffff,//设置颜色
            // color: 0xff0000,//设置颜色
            map: this.textureLoader.load('/geojson/dahua.png', console.log, console.log, console.log),
            transparent: true, //使用背景透明的png贴图，注意开启透明计算
            // opacity: 0.5,
            // side: DoubleSide, //双面可见
        });
        const vec3 = new Three.Vector3()
        const center = new Three.Vector3()
        box3.getSize(vec3)
        box3.getCenter(center)
        var geometry = new Three.PlaneGeometry(vec3.x, vec3.y); //默认在XOY平面上
        var mesh = new Three.Mesh(geometry, material);
        mesh.position.set(center.x, center.y, vec3.z + 0.01);//设置mesh位置
        return mesh;
    }


    initSize(width: number, height: number) {
        this.size.x = width
        this.size.y = height
    }

    generateRenderer() {
        const renderer = new Three.WebGLRenderer();
        renderer.setSize(this.size.x, this.size.y);
        this.el.appendChild(renderer.domElement);
        return renderer
    }

    generateCamera() {
        const k = this.aspectRatio
        const s = this.s
        // const camera = new Three.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
        const camera = new Three.PerspectiveCamera(45, this.aspectRatio, 0.1, 20);
        camera.position.z = 4;
        camera.up = new Three.Vector3(0, 0, 1); // 使controls的水平旋转轴线为z轴
        return camera
    }

    generateControls() {
        const controls = new MapControls(this.camera, this.renderer.domElement);
        // const controls = new MyControls(this.camera, this.renderer.domElement);
        // const controls = new OrbitControls(camera, renderer.domElement);
        controls.minPolarAngle = 0; // 向下翻转的角度
        controls.maxPolarAngle = (Math.PI / 180) * 85; // 向上翻转的角度
        // controls.minAzimuthAngle = 0;
        // controls.maxAzimuthAngle = 0;
        // controls.addEventListener('end', (e) => {
        //     // controls.object.up.setX(this.center.x)
        //     // controls.object.up.setY(this.center.y)
        //     // controls.object.up.setZ(this.center.z)
        //     console.log(e, this.center, controls.object.up)
        //
        // })
        return controls
    }


    onRender() {
        requestAnimationFrame(this.onRender.bind(this));
        this.controls.update();
        this.renderer.render(this.scene, this.camera)
    }

}
