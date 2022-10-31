import {IFeatureObject, IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import {getBox3ByObject3D, getCenterByBox3, getSizeByBox3, mergeBufferGeometries} from "/@/hooks/three3d/lib/utils";
import * as Three from "three";
import BigNumber from "bignumber.js";
import Component from "/@/hooks/three3d/lib/abstracts/Component";

export default class MapLayer extends Component {
    lineGroup = new Three.Group()
    extrudeShareGroup = new Three.Group()

    lineMaterial = new Three.LineBasicMaterial({
        // color: 0x00cccc, //线条颜色
        color: 0xffffff, //线条颜色
        // depthTest: false, // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)
    }); //线段材质对象
    standardMaterial = new Three.MeshStandardMaterial({
        // color: 0x004444,
        color: 0xffffff,
        // opacity: 0.8,
        // bumpScale: 1, // 凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。
        // roughness: 1, // 材质的粗糙程度。0.0表示平滑的镜面反射
        // metalness: 0.0, // 材质与金属的相似度
        // side: DoubleSide, //两面可见
    }); // 形状材质对象

    lambertMaterial = new Three.MeshLambertMaterial({
        // color: 0x004444,
        color: 0xffffff,
        // opacity: 0.8,
        // bumpScale: 1, // 凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。
        // roughness: 1, // 材质的粗糙程度。0.0表示平滑的镜面反射
        // metalness: 0.0, // 材质与金属的相似度
        // side: DoubleSide, //两面可见
    }); // 形状材质对象

    // 数据准备就绪
    onReady() {
        const box3 = getBox3ByObject3D(this.map.mapGroup)
        const size = getSizeByBox3(box3)
        const center = getCenterByBox3(box3)
        this.map.center = center
        this.generateMap(this.map.featureObjects)
    }

    generateMap(featureObjects: IFeatureObject[], loop = true) {
        featureObjects.forEach(item => { // 每一个区域
            const shapeGeos: Three.ExtrudeGeometry[] = []
            item.geometry.forEach(arr => {
                const vector2Arr: Three.Vector2[] = []
                const vector3Arr: Three.Vector3[] = []
                arr.forEach((elem: any) => {
                    const v = this.map.mProjection(elem)
                    if (v) {
                        vector2Arr.push(new Three.Vector2(v[0], -v[1]))
                        vector3Arr.push(new Three.Vector3(v[0], -v[1], 0.103))
                    }
                })
                shapeGeos.push(this.getExtrudeGeometry(new Three.Shape(vector2Arr)))
                this.drawLine(vector3Arr, item.properties, loop)
            })
            const geo = mergeBufferGeometries(shapeGeos)
            this.drawExtrudeShareByGeometry(geo, item.properties)
        })
        this.map.mapGroup.add(this.lineGroup)
        this.map.mapGroup.add(this.extrudeShareGroup)
        // this.drawBackgroundPlane(this.lineGroup)
    }

    drawBackgroundPlane(object3D: Three.Object3D, multiply: number = 2.5) {
        const box3 = getBox3ByObject3D(object3D)
        const size = getSizeByBox3(box3).multiply(new Three.Vector3(multiply, multiply, multiply))
        const center = getCenterByBox3(box3)
        const textureUrl = `/geojson/dahua/texture/bg.png`;
        const texture = this.map.textureLoader.load(textureUrl)
        texture.wrapS = Three.RepeatWrapping;
        texture.wrapT = Three.RepeatWrapping;
        const material = this.standardMaterial.clone();
        material.map = texture
        material.transparent = true
        const geometry = new Three.PlaneGeometry(size.x, size.y); //默认在XOY平面上
        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(center.x, center.y, 0);//设置mesh位置
        this.map.mapGroup.add(mesh)
    }

    drawPlaneTextureByBox3(box3: Three.Box3, textureUrl: string, zOffset = 0) {
        const texture = this.map.textureLoader.load(textureUrl)
        texture.wrapS = Three.RepeatWrapping;
        texture.wrapT = Three.RepeatWrapping;
        const material = this.standardMaterial.clone();
        material.map = texture
        material.transparent = true
        material.alphaTest = 0.1 //  (解决闪烁的问题)
        material.depthTest = false // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)

        const size = getSizeByBox3(box3)
        const center = getCenterByBox3(box3)
        const geometry = new Three.PlaneGeometry(size.x, size.y); //默认在XOY平面上
        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(center.x, center.y, BigNumber(size.z).plus(zOffset).toNumber());//设置mesh位置
        // mesh.renderOrder = 100; // 设置贴图渲染排序（解决模型重合闪烁的问题）
        return mesh;
    }

    getGeometryByPoints(points: Three.Vector3[]) {
        return new Three.BufferGeometry().setFromPoints(points);
    }

    drawLine(points: Three.Vector3[], properties: IFeatureProperties, loop = true) {
        const geometry = this.getGeometryByPoints(points);
        if (loop) { //线条模型对象
            this.lineGroup.add(new Three.Line(geometry, this.lineMaterial));
        } else { //首尾顶点连线，轮廓闭合
            this.lineGroup.add(new Three.LineLoop(geometry, this.lineMaterial));
        }
    }

    drawExtrudeShareByGeometry(geometry: Three.BufferGeometry, properties: IFeatureProperties) {
        const material1 = this.lambertMaterial.clone()
        // material1.transparent = true
        const texture2Url = `/geojson/dahua/texture/extrude_bg.png`;
        // const texture2Url = `/geojson/贴图.png`;
        const texture = this.map.textureLoader.load(texture2Url)
        texture.wrapS = Three.RepeatWrapping
        texture.wrapT = Three.RepeatWrapping
        const material2 = this.lambertMaterial.clone()
        // material2.map = texture;
        // material2.transparent = true;
        const textureUrl = `/geojson/dahua/texture/${properties.name}.png`;

        const mesh = new Three.Mesh(geometry, [material1, material2]); //网格模型对象
        const box3 = getBox3ByObject3D(mesh)
        const planeMesh = this.drawPlaneTextureByBox3(box3, textureUrl)
        // const planeMesh2 = this.drawPlaneTextureByBox3(box3, '/geojson/贴图.png', 0.02)
        const shareGroup = new Three.Group()

        shareGroup.add(mesh)
        shareGroup.add(planeMesh)
        // shareGroup.add(planeMesh2)
        this.extrudeShareGroup.add(shareGroup)
        // this.map.scene.add(shareGroup)
        // this.map.scene.add(planeMesh2)
    }

    getExtrudeGeometry(shapes: Three.Shape | Three.Shape[]) {
        return new Three.ExtrudeGeometry(shapes, {
            depth: 0.1, //拉伸高度 根据行政区尺寸范围设置，比如高度设置为尺寸范围的2%，过小感觉不到高度，过大太高了
            // bevelEnabled: false, //无倒角
            curveSegments: 28, // 曲线上点的数量，默认值是12
            bevelEnabled: true, // 对挤出的形状应用是否斜角，默认值为true
            bevelThickness: 0.001, // 设置原始形状上斜角的厚度。默认值为0.2。
            bevelSize: 0.001, // 斜角与原始形状轮廓之间的延伸距离，默认值为bevelThickness-0.1。
            bevelOffset: 0.0001, // 与倒角开始的形状轮廓的距离。默认值为0。
            bevelSegments: 1, // 斜角的分段层数，默认值为3。

        });
    }
}
