import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import * as Three from "three";
import {IFeatureObject, IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import BigNumber from "bignumber.js";

export default class MapLayer {
    map: Three3DMap
    lineGroup = new Three.Group()
    extrudeShareGroup = new Three.Group()

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
        const box3 = this.getBox3ByObject3D(this.map.mapGroup)
        const size = this.getSizeByBox3(box3)
        const center = this.getCenterByBox3(box3)
        this.map.center = center
    }

    getBox3ByObject3D(object3D: Three.Object3D) {
        const box3 = new Three.Box3();//创建一个包围盒
        box3.expandByObject(object3D);
        return box3;
    }

    getSizeByBox3(box3: Three.Box3) {
        //scaleV3表示包围盒长宽高尺寸
        const size = new Three.Vector3();
        box3.getSize(size)
        // 查看控制台包围盒大小，辅助设置相机参数
        console.log('查看包围盒尺寸', size);
        return size
    }

    getCenterByBox3(box3: Three.Box3) {
        // 计算一个层级模型对应包围盒的几何体中心
        const center = new Three.Vector3();
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
                this.drawLine(vector3Arr, item.properties, loop)
                this.drawExtrudeShare(new Three.Shape(vector2Arr), item.properties)
            })
        })
        // this.map.mapGroup.add(this.lineGroup)
        this.map.mapGroup.add(this.extrudeShareGroup)
    }

    drawPlaneTextureByBox3(box3: Three.Box3, textureUrl: string, zOffset = 0, options: any = {}) {
        const texture = this.map.textureLoader.load(textureUrl)
        texture.wrapS = Three.RepeatWrapping;
        texture.wrapT = Three.RepeatWrapping;
        const material = new Three.MeshLambertMaterial({
            color: 0xffffff,//设置颜色
            // color: 0xff0000,//设置颜色
            map: texture,
            transparent: true, //使用背景透明的png贴图，注意开启透明计算
            depthTest: false, // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)
            // polygonOffset: true,
            // polygonOffsetUnits: 4,
            // polygonOffsetFactor: 0.41,
            // opacity: 0.5,
            // side: Three.DoubleSide, //双面可见
            ...options
        });
        const size = new Three.Vector3()
        const center = new Three.Vector3()
        box3.getSize(size)
        box3.getCenter(center)
        const geometry = new Three.PlaneGeometry(size.x, size.y); //默认在XOY平面上
        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(center.x, center.y, BigNumber(size.z).plus(zOffset).toNumber());//设置mesh位置
        // mesh.renderOrder = 100; // 设置贴图渲染排序（解决模型重合闪烁的问题）
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
        const geometry = new Three.ExtrudeGeometry(shapes, {
            depth: 0.1, //拉伸高度 根据行政区尺寸范围设置，比如高度设置为尺寸范围的2%，过小感觉不到高度，过大太高了
            bevelEnabled: false //无倒角
        });
        const material1 = this.shareMaterial.clone()
        const mesh = new Three.Mesh(geometry, material1); //网格模型对象
        const textureUrl = `/geojson/dahua/texture/${properties.name}.png`;
        const box3 = this.getBox3ByObject3D(mesh)
        const planeMesh = this.drawPlaneTextureByBox3(box3, textureUrl)
        // const planeMesh2 = this.drawPlaneTextureByBox3(box3, '/geojson/贴图.png', 0.02)
        const shareGroup = new Three.Group()

        shareGroup.add(mesh)
        shareGroup.add(planeMesh)
        // shareGroup.add(planeMesh2)
        this.extrudeShareGroup.add(shareGroup)
        // this.map.scene.add(mesh)
        // this.map.scene.add(planeMesh2)
    }
}
