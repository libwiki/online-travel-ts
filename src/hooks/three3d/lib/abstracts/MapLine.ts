import Component from "/@/hooks/three3d/lib/abstracts/Component";
import * as Three from "three";
import {IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import BigNumber from "bignumber.js";

export default class MapLine extends Component {
    protected lineGroup = new Three.Group()
    protected useLine2 = true; // Line2可设置线段宽度
    protected lineScale: number = 1; // 线段的缩放比例（线段的基础单位由底图的大小决定）
    protected colors = [
        new Three.Color(0xcccccc),
    ]
    protected lineMaterial = new LineMaterial({
        depthTest: true,
        color: this.colors[0].getHex(),
    });
    protected lineBasicMaterial = new Three.LineBasicMaterial({
        color: this.colors[0], //线条颜色
        // color: 0xffffff, //线条颜色
        // depthTest: false, // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)
    }); //线段材质对象

    onReady() {
        super.onReady();
        this.lineGroup.name = 'lineGroup'
        this.lineMaterial.linewidth = this.lineWidth
        this.lineBasicMaterial.linewidth = this.lineWidth
    }

    get lineWidth() {
        return BigNumber(this.map.mapAreaLineWidth).multipliedBy(this.lineScale).toNumber()
    }

    // 生成区域边界线
    protected drawLine(points: Three.Vector3[], properties: IFeatureProperties, lineMaterial?: Three.LineBasicMaterial, loop = true) {
        const geometry = new Three.BufferGeometry().setFromPoints(points);
        lineMaterial = lineMaterial || this.lineBasicMaterial; // 共享材质（方便色彩渐变动画，后续如果需要扩展可自行改动）
        const line = loop ? new Three.LineLoop(geometry, lineMaterial) : new Three.Line(geometry, lineMaterial)
        line.name = properties.name
        line.userData = properties
        this.lineGroup.add(line);
        return line
    }

    protected drawLine2(pointArr: number[], properties: IFeatureProperties, lineMaterial?: LineMaterial, loop = true) {
        const geometry = new LineGeometry().setPositions(pointArr);
        lineMaterial = lineMaterial || this.lineMaterial; // 共享材质（方便色彩渐变动画，后续如果需要扩展可自行改动）
        //材质输入Three.js渲染canvas画布的宽高度
        const line = new Line2(geometry, lineMaterial)
        line.name = properties.name
        line.userData = properties
        this.lineGroup.add(line);
        return line
    }
}
