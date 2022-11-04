import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {IFeatureObject, IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import * as Three from "three";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {Line2} from "three/examples/jsm/lines/Line2";
import {Easing, Tween} from "@tweenjs/tween.js";

// 每一个区域的边界线
export default class MapAreaLine extends Component {
    protected lineGroup = new Three.Group()
    protected useLine2 = true; // Line2可设置线段宽度
    protected lineColors = [
        new Three.Color(0xcccccc),
        // new Three.Color(0xbbbbbb),
        // new Three.Color(0xffffff),
        new Three.Color(0xFF4400),
    ]
    tweenInstances: Map<string, Tween<any>> = new Map()

    protected lineMaterial = new LineMaterial({
        depthTest: true,
        color: this.lineColors[0].getHex(),
    });
    protected lineBasicMaterial = new Three.LineBasicMaterial({
        color: this.lineColors[0], //线条颜色
        // color: 0xffffff, //线条颜色
        // depthTest: false, // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)
    }); //线段材质对象

    onReady() {
        super.onReady();
        this.lineGroup.name = 'lineGroup'
        this.lineMaterial.linewidth = this.map.mapAreaLineWidth
        this.lineBasicMaterial.linewidth = this.map.mapAreaLineWidth
        this.generateMapAreaLine(this.map.areaFeatureObjects)
        this.runBreathingTween(); // 启动边界线的颜色变化 动画

    }

    // 动画曲线参考：https://www.createjs.com/demos/tweenjs/tween_sparktable
    protected runBreathingTween() {
        const inTween = new Tween<Three.Color>(this.lineColors[0].clone()).to(this.lineColors[1], 1000).onUpdate((color) => {
            this.lineMaterial.color.copy(color)
            this.lineBasicMaterial.color.copy(color)
        })
        const outTween = new Tween<Three.Color>(this.lineColors[1].clone()).to(this.lineColors[0], 1000).onUpdate((color) => {
            this.lineMaterial.color.copy(color)
            this.lineBasicMaterial.color.copy(color)
        }).easing(Easing.Quartic.Out)
        inTween.chain(outTween)
        outTween.chain(inTween)
        this.tweenInstances.set('inTween', inTween)
        this.tweenInstances.set('outTween', outTween)
        inTween.start()
    }

    onUpdate(deltaTime: number) {
        super.onUpdate(deltaTime);
        this.tweenInstances.forEach(v => v.update())
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
        const lineMaterial = this.lineBasicMaterial; // 共享材质（方便色彩渐变动画，后续如果需要扩展可自行改动）
        const line = loop ? new Three.LineLoop(geometry, lineMaterial) : new Three.Line(geometry, lineMaterial)
        line.name = properties.name
        line.userData = properties
        this.lineGroup.add(line);
    }

    protected drawLine2(pointArr: number[], properties: IFeatureProperties, loop = true) {
        const geometry = new LineGeometry().setPositions(pointArr);
        const lineMaterial = this.lineMaterial; // 共享材质（方便色彩渐变动画，后续如果需要扩展可自行改动）
        //材质输入Three.js渲染canvas画布的宽高度
        const line = new Line2(geometry, lineMaterial)
        line.name = properties.name
        line.userData = properties
        this.lineGroup.add(line);
    }
}
