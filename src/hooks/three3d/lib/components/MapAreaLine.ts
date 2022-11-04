import {IFeatureObject} from "/@/hooks/three3d/lib/Interfaces";
import * as Three from "three";
import {Easing, Tween} from "@tweenjs/tween.js";
import MapLine from "/@/hooks/three3d/lib/abstracts/MapLine";

// 每一个区域的边界线
export default class MapAreaLine extends MapLine {
    protected lineColors = [
        new Three.Color(0xcccccc),
        // new Three.Color(0xbbbbbb),
        // new Three.Color(0xffffff),
        new Three.Color(0xff0000),
    ]
    tweenInstances: Map<string, Tween<any>> = new Map()

    onReady() {
        super.onReady();
        if (this.map.debug.enableAreaLineTween) {
            this.lineGroup.name = 'areaLineGroup'
            this.generateMapAreaLine(this.map.areaFeatureObjects)
            this.runBreathingTween(); // 启动边界线的颜色变化 动画
        }
    }

    // 动画曲线参考：https://www.createjs.com/demos/tweenjs/tween_sparktable
    protected runBreathingTween() {
        const inTween = new Tween<Three.Color>(this.lineColors[0].clone()).to(this.lineColors[1], 1200).onUpdate((color) => {
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

    generateMapAreaLine(featureObjects: IFeatureObject[]) {
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
                    this.drawLine2(positions, item.properties); // 生成区域线条
                } else {
                    this.drawLine(vector3Arr, item.properties); // 生成区域线条（无法设置线宽）
                }
            })
        })
        // 附加到场景地图分组中（会在onUpdate中进行渲染）
        this.map.mapGroup.add(this.lineGroup)
    }

}
