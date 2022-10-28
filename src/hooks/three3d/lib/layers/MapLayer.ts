import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import {
    Box3,
    ExtrudeGeometry,
    Group,
    Line,
    LineLoop,
    Mesh,
    MeshLambertMaterial,
    Path,
    Shape,
    Vector2,
    Vector3
} from "three";
import {IFeatureObject, IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import * as Three from "three";

export default class MapLayer {
    map: Three3DMap
    lineGroup = new Group()
    extrudeShareGroup = new Group()

    lineMaterial = new Three.LineBasicMaterial({
        color: 0x00cccc //线条颜色
    }); //线段材质对象
    shareMaterial = new Three.MeshLambertMaterial({
        // color: 0x004444,
        color: 0xffffff,
        // side: DoubleSide, //两面可见
    }); // 形状材质对象


    constructor(map: Three3DMap) {
        this.map = map
    }

    onRender() {
        this.generateMap(this.map.featureObjects)
        this.initBoxInfo();
    }

    initBoxInfo() {
        const box3 = this.getBox3ByGroup(this.map.mapGroup)
        const size = this.getSizeByBox3(box3)
        const center = this.getCenterByBox3(box3)
        this.map.center = center
    }

    getBox3ByGroup(group: Group) {
        const box3 = new Box3();//创建一个包围盒
        box3.expandByObject(group);
        return box3;
    }

    getSizeByBox3(box3: Box3) {
        //scaleV3表示包围盒长宽高尺寸
        const size = new Vector3();
        box3.getSize(size)
        // 查看控制台包围盒大小，辅助设置相机参数
        console.log('查看包围盒尺寸', size);
        return size
    }

    getCenterByBox3(box3: Box3) {
        // 计算一个层级模型对应包围盒的几何体中心
        const center = new Vector3();
        box3.getCenter(center);
        console.log('查看几何中心', center);
        return center
    }

    generateMap(featureObjects: IFeatureObject[], loop = true) {
        featureObjects.forEach(item => { // 每一个区域
            item.geometry.forEach(arr => {
                const vector2Arr: Three.Vector2[] = []
                const vector3Arr: Three.Vector3[] = []
                arr.forEach((elem: any) => {
                    const v = this.map.mProjection(elem)
                    if (v) {
                        vector2Arr.push(new Three.Vector2(v[0], -v[1]))
                        vector3Arr.push(new Three.Vector3(v[0], -v[1], 0))
                    }
                })
                this.drawLine(vector3Arr, item.properties)
                this.drawExtrudeShare(new Three.Shape(vector2Arr), item.properties)
            })
        })
        // this.map.mapGroup.add(this.lineGroup)
        this.map.mapGroup.add(this.extrudeShareGroup)
    }

    cityPointMesh(box3: Three.Box3) {
        var material = new Three.MeshBasicMaterial({
            color: 0xffffff,//设置颜色
            // color: 0xff0000,//设置颜色
            map: this.map.textureLoader.load('/geojson/dahua/texture/area.png', console.log, console.log, console.log),
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

    drawLine(points: Three.Vector3[], properties: IFeatureProperties, loop = true) {
        const geometry = new Three.BufferGeometry().setFromPoints(points);
        if (loop) { //线条模型对象
            this.lineGroup.add(new Three.Line(geometry, this.lineMaterial));
        } else { //首尾顶点连线，轮廓闭合
            this.lineGroup.add(new Three.LineLoop(geometry, this.lineMaterial));

        }
    }

    drawExtrudeShare(shapes: Three.Shape | Three.Shape[], properties: IFeatureProperties) {
        const geometry = new Three.ShapeGeometry(shapes)
        // const geometry = new Three.ExtrudeGeometry(shapes, {
        //     depth: 0.1, //拉伸高度 根据行政区尺寸范围设置，比如高度设置为尺寸范围的2%，过小感觉不到高度，过大太高了
        //     bevelEnabled: false //无倒角
        // });
        const material1 = this.shareMaterial.clone()
        material1.transparent = true
        // material1.color = new Three.Color(0xff3300)
        if (true || ['白马乡', '共和乡'].includes(properties.name)) {
            const texture = this.map.textureLoader.load(`/geojson/dahua/texture/${properties.name}.png`, (e) => {
                console.log('texture load ', properties.name, e)
            }, (e) => {
                console.log('texture error ', e, properties)
            })
            texture.wrapS = Three.RepeatWrapping;
            texture.wrapT = Three.RepeatWrapping;
            material1.map = texture
        }
        // const material2 = this.shareMaterial.clone()
        // material2.transparent = true
        // // material2.color = new Three.Color(0xff0000)
        // const texture2 = this.map.textureLoader.load('/geojson/dahua/texture/extrude_bg.png')
        // texture2.wrapS = Three.RepeatWrapping;
        // texture2.wrapT = Three.RepeatWrapping;
        // material2.map = texture2
        const mesh = new Three.Mesh(geometry, material1); //网格模型对象
        this.extrudeShareGroup.add(mesh)
    }
}
