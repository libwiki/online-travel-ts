import {IFeatureObject} from "/@/hooks/three3d/lib/Interfaces";
import * as Three from "three";
import MapLine from "/@/hooks/three3d/lib/abstracts/MapLine";
import _ from "lodash";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {Line2} from "three/examples/jsm/lines/Line2";

export default class MapBorderLine extends MapLine {
    protected lineScale = 2;
    protected colors = [
        new Three.Color(0x00ffff),
    ];
    allPoints: number[] = []; // 所有的点，用于实现宝马灯的线条动画路径
    protected marqueeLine?: Line2
    protected currentMarqueeIndex = 0;
    protected marqueeIntervalTime = 200;
    protected preDeltaTime = 0;

    onReady() {
        super.onReady();
        if (this.map.debug.enableBorderLineTween) {
            this.lineGroup.name = 'borderLineGroup'
            this.generateMapBorderLine(this.map.borderlineFeatureObjects)

        }
    }

    onUpdate(deltaTime: number) {
        super.onUpdate(deltaTime);
        if (this.map.debug.enableBorderLineTween && deltaTime - this.preDeltaTime >= this.marqueeIntervalTime) {
            this.preDeltaTime = deltaTime;
            const nextIndex = this.currentMarqueeIndex + 1;
            this.currentMarqueeIndex = nextIndex >= this.chunkPoints.length ? 0 : nextIndex;
            const chunks = this.chunkPoints[nextIndex]
            if (chunks) {
                this.marqueeLine?.geometry.setPositions(chunks)
            }
        }
    }

    get chunkPoints(): number[][] { // 宝马等的线段长短
        return _.chunk(this.allPoints, 3 * 10)
    }

    protected generateMapBorderLine(featureObjects: IFeatureObject[]) {
        const z = this.map.mapAreaLineZAxisHeight
        featureObjects.forEach(item => { // 每一个区域
            item.geometry.forEach(arr => {
                const positions: number[] = []
                arr.forEach((elem: any) => {
                    const v = this.map.mProjection(elem)
                    if (v) {
                        positions.push(v[0], -v[1], z)
                    }
                })
                this.drawLine2(positions, item.properties); // 生成区域线条
                this.allPoints.push(...positions)
            })
        })
        if (this.chunkPoints.length > 0) {
            this.generateMarqueeLine(this.chunkPoints[0])
        }
        // 附加到场景地图分组中（会在onUpdate中进行渲染）
        this.map.mapGroup.add(this.lineGroup)
    }

    protected generateMarqueeLine(positions: number[]) {
        const lineMaterial = new LineMaterial({
            depthTest: true,
            color: 0x00ffff,
            linewidth: this.lineWidth,
        });
        this.marqueeLine = this.drawLine2(positions, {name: 'MapRunningBorderLine2'}, lineMaterial)
    }

}
