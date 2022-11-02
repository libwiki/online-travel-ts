import {IFeatureObject, IFeatureProperties, RayCasterEvents} from "/@/hooks/three3d/lib/Interfaces";
import {getBox3ByObject3D, getCenterByBox3, getSizeByBox3, mergeBufferGeometries} from "/@/hooks/three3d/lib/utils";
import * as Three from "three";
import BigNumber from "bignumber.js";
import Component from "/@/hooks/three3d/lib/abstracts/Component";
import Tag from "/@/hooks/three3d/lib/htmlComponents/tags/Tag";
import RayCasters from "/@/hooks/three3d/lib/components/RayCasters";
import {Object3D, Raycaster} from "three";
import _ from "lodash";

export default class MapLayer extends Component {
    tagGroup = new Three.Group()
    lineGroup = new Three.Group()
    shareGroup = new Three.Group()
    shareCoverGroup = new Three.Group()
    extrudeShareGroup = new Three.Group()
    tagComponents: Tag[] = []
    hoverPanel?: Three.Mesh // 当前鼠标经过的面

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

    onStart() {
        super.onStart();
        this.tagGroup.name = 'tagGroup'
        this.lineGroup.name = 'lineGroup'
        this.shareGroup.name = 'shareGroup'
        this.shareCoverGroup.name = 'shareCoverGroup'
        this.extrudeShareGroup.name = 'extrudeShareGroup'
        this.extrudeShareGroup.add(this.shareGroup)
        this.extrudeShareGroup.add(this.shareCoverGroup)
    }

    // 数据准备就绪
    onReady() {
        this.generateMap(this.map.featureObjects)
    }

    onUpdate() {
        super.onUpdate();
        this.tagComponents.forEach(v => v.onUpdate())
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
        // 附加到场景地图分组中（会在onUpdate中进行渲染）
        this.map.mapGroup.add(this.lineGroup)
        this.map.mapGroup.add(this.extrudeShareGroup)
        this.map.mapGroup.add(this.tagGroup)
        this.bindEvents(); // 绑定射线事件

        const box3 = getBox3ByObject3D(this.map.mapGroup)
        const center = getCenterByBox3(box3)
        const mapSize = getSizeByBox3(box3)
        this.map.center = center
        this.map.mapSize = mapSize
    }

    bindEvents() {
        this.map.rayCasters.emitter.on(RayCasterEvents.pointermove, (ray) => {
            this._handleShareCoverGroupPointEvents(RayCasterEvents.pointermove, ray)
        })
    }

    // 处理面的鼠标经过事件
    protected _handleShareCoverGroupPointEvents(eventType: RayCasterEvents, ray: Raycaster) {
        const objects = ray.intersectObjects<Three.Mesh>(this.shareGroup.children, false)
        if (objects.length > 0) {
            if (this.shareCoverGroup.children.length > 0) { // 贴图是通过另外的平面覆盖在形状面板上的
                const name = objects[0].object.name;
                const panel = this.shareCoverGroup.children.find(v => v.name === name) as Three.Mesh
                this.toggleHoverPanel(panel)
            } else { // 不存在贴图(直接设置形状面板的hover状态)
                this.toggleHoverPanel(objects[0].object)
            }

        } else {
            this.toggleHoverPanel()
        }
    }

    // 鼠标经过的面（来源于bindEvents）
    toggleHoverPanel(panel?: Three.Mesh, force = false) {
        if (!force && panel && this.hoverPanel && this.hoverPanel.name === panel.name) {
            return
        }
        if (panel) {
            const material = panel.material as Three.MeshStandardMaterial | Three.MeshStandardMaterial[]
            if (_.isArray(material)) {
                material[0].color.set(0xff0000)
            } else {
                material.color.set(0xff0000)
            }
        }
        if (this.hoverPanel) {
            const material = this.hoverPanel.material as Three.MeshStandardMaterial | Three.MeshStandardMaterial[]
            if (_.isArray(material)) {
                material[0].color.set(0xffffff)
            } else {
                material.color.set(0xffffff)
            }
        }
        this.hoverPanel = panel

    }

    // 生成背景图
    drawBackgroundPlane(object3D: Three.Object3D, multiply: number = 2.5) {
        const box3 = getBox3ByObject3D(object3D)
        const size = getSizeByBox3(box3).multiply(new Three.Vector3(multiply, multiply, multiply))
        const center = getCenterByBox3(box3)
        const textureUrl = `/geojson/dahua/texture/bg.png`;
        const texture = this.map.loadTexture(textureUrl)
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


    getGeometryByPoints(points: Three.Vector3[]) {
        return new Three.BufferGeometry().setFromPoints(points);
    }

    // 生成区域边界线
    drawLine(points: Three.Vector3[], properties: IFeatureProperties, loop = true) {
        const geometry = this.getGeometryByPoints(points);
        const lineMaterial = this.lineMaterial.clone()
        const line = loop ? new Three.LineLoop(geometry, lineMaterial) : new Three.Line(geometry, lineMaterial)
        line.name = properties.name
        line.userData = properties
        this.lineGroup.add(line);
    }


    // 生成边界面板以及附属对象
    drawExtrudeShareByGeometry(geometry: Three.BufferGeometry, properties: IFeatureProperties) {
        const material1 = this.lambertMaterial.clone()
        // material1.transparent = true
        const texture2Url = `/geojson/dahua/texture/extrude_bg.png`;
        // const texture2Url = `/geojson/贴图.png`;
        const texture = this.map.loadTexture(texture2Url)
        texture.wrapS = Three.RepeatWrapping
        texture.wrapT = Three.RepeatWrapping
        const material2 = this.lambertMaterial.clone()
        // material2.map = texture;
        // material2.transparent = true;

        const mesh = new Three.Mesh(geometry, [material1, material2]); //网格模型对象
        mesh.name = properties.name;
        mesh.userData = properties;
        const box3 = getBox3ByObject3D(mesh)
        this.drawAreaTag(box3, properties)
        this.drawPlaneTextureByBox3(box3, properties)

        // const planeMesh2 = this.drawPlaneTextureByBox3(box3, '/geojson/贴图.png', 0.02)
        this.shareGroup.add(mesh)

        // this.extrudeShareGroup.add(planeMesh)
        // this.map.scene.add(shareGroup)
        // this.map.scene.add(planeMesh2)
    }

    // 生成每一个区域的标签
    drawAreaTag(box3: Three.Box3, properties: IFeatureProperties) {
        const tag = new Tag(this.map, properties.name)
        tag.onCreate(getCenterByBox3(box3), properties)
        this.tagComponents.push(tag)
        this.tagGroup.add(tag.object3d)
    }

    // 生成边界贴图
    async drawPlaneTextureByBox3(box3: Three.Box3, properties: IFeatureProperties, zOffset = 0) {
        try {
            const textureUrl = `/geojson/dahua/texture/${properties.name}.png`;
            const texture = await this.map.loadTextureAsync(textureUrl)
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
            mesh.name = properties.name;
            mesh.userData = properties;
            mesh.position.set(center.x, center.y, BigNumber(size.z).plus(zOffset).toNumber());//设置mesh位置
            // mesh.renderOrder = 100; // 设置贴图渲染排序（解决模型重合闪烁的问题）
            this.shareCoverGroup.add(mesh)
        } catch (e) {

        }
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
