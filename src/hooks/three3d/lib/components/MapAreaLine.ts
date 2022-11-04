import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {IFeatureObject, IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import * as Three from "three";
import {mergeBufferGeometries} from "/@/hooks/three3d/lib/utils";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {Line2} from "three/examples/jsm/lines/Line2";

export default class MapAreaLine extends Component {
    protected lineGroup = new Three.Group()
    protected useLine2 = true; // Line2可设置线段宽度

    protected lineMaterial = new LineMaterial({
        depthTest: true,
        color: 0xcccccc, //设置线条颜色值
        linewidth: 0.002, // 设置线宽
    });
    protected lineBasicMaterial = new Three.LineBasicMaterial({
        color: 0x00cccc, //线条颜色
        // color: 0xffffff, //线条颜色
        // depthTest: false, // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)
    }); //线段材质对象

    onReady() {
        super.onReady();
        this.lineGroup.name = 'lineGroup'
        this.lineMaterial.linewidth = this.map.mapAreaLineWidth
        this.lineBasicMaterial.linewidth = this.map.mapAreaLineWidth
        this.generateMapAreaLine(this.map.areaFeatureObjects)
    }

    generateMapAreaLine(featureObjects: IFeatureObject[], loop = true) {
        const z = this.map.mapAreaLineZAxisHeight
        featureObjects.forEach(item => { // 每一个区域
            item.geometry.forEach(arr => {
                const vector3Arr: Three.Vector3[] = []
                const positions: number[] = []
                arr.forEach((elem: any) => {
                    const v = this.map.mProjection(elem)
                    if (v) {
                        if (this.useLine2) {
                            positions.push(v[0], -v[1], z)
                        } else {
                            vector3Arr.push(new Three.Vector3(v[0], -v[1], z))
                        }
                    }
                })
                if (this.useLine2) {
                    this.drawLine2(positions, item.properties, loop); // 生成区域线条
                } else {
                    this.drawLine(vector3Arr, item.properties, loop); // 生成区域线条（无法设置线宽）
                }
            })
        })
        // 附加到场景地图分组中（会在onUpdate中进行渲染）
        this.map.mapGroup.add(this.lineGroup)
    }

    // 生成区域边界线
    protected drawLine(points: Three.Vector3[], properties: IFeatureProperties, loop = true) {
        const geometry = new Three.BufferGeometry().setFromPoints(points);
        const lineMaterial = this.lineBasicMaterial.clone()
        const line = loop ? new Three.LineLoop(geometry, lineMaterial) : new Three.Line(geometry, lineMaterial)
        line.name = properties.name
        line.userData = properties
        this.lineGroup.add(line);
    }

    protected drawLine2(pointArr: number[], properties: IFeatureProperties, loop = true) {
        const geometry = new LineGeometry().setPositions(pointArr);
        const lineMaterial = this.lineMaterial.clone();
        //材质输入Three.js渲染canvas画布的宽高度
        const line = new Line2(geometry, lineMaterial)
        line.name = properties.name
        line.userData = properties
        this.lineGroup.add(line);
    }
}
