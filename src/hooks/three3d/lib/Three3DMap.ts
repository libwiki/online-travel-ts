import {isString} from "lodash";
import {Coordinate, IGeoFeature} from "/@/@types/geoJson";
import {IFeatureObject} from "/@/hooks/three3d/lib/Interfaces";
import BaseThree3DMap from "/@/hooks/three3d/lib/abstracts/BaseThree3DMap";

const MaxTryRunning = 5;
export default class Three3DMap extends BaseThree3DMap {
    private tryRunning = 0;

    // /geojson/dahua/geo.json
    loadJson(jsonUrl: string = '/geojson/dahua/geo.json') {
        if (this.isRunning) { // 当前正在运行中
            this.onDispose(); // 先卸载旧地图，下一帧重新启动
            if (this.tryRunning >= MaxTryRunning) {
                throw new Error("程序已经进入了死循环，大部分情况为自行控制【isRunning】状态引起的，请查验逻辑！")
            }
            requestAnimationFrame(() => {
                this.tryRunning++
                this.loadJson(jsonUrl); // 重新启动
            })
            return
        } else { // 当前已经停止,需要重新启动帧刷新
            this.tryRunning = 0;
            this.isRunning = true
        }
        this.fileLoader.load(jsonUrl, (data: any) => {
            if (isString(data)) {
                try {
                    data = JSON.parse(data)
                } catch (e) {
                    return;
                }
            }
            const featureObjects: IFeatureObject[] = [];
            data.features.forEach((feature: IGeoFeature<any>, index: number) => {
                const properties = {
                    name: feature.properties.name,
                    city: feature.properties.city,
                    country: feature.properties.country,
                    province: feature.properties.province,
                }
                if (feature.geometry.type === 'Polygon') {
                    const geometry = this.parsePolygons([feature.geometry.coordinates], index)
                    featureObjects.push({geometry, properties})
                } else if (feature.geometry.type === 'MultiPolygon') {
                    const geometry = this.parsePolygons(feature.geometry.coordinates, index)
                    featureObjects.push({geometry, properties})
                }
            })
            this.featureObjects = featureObjects; // MapLayer组件需要featureObjects数据
            this.onReady(); // 需要先执行MapLayer组件后方可获取到实际的center和mapSize
            this.camera.position.set(this.center.x, this.center.y, this.camera.position.z); //沿着z轴观察
            this.controls.target.set(this.center.x, this.center.y, this.controls.target.z);
            // this.camera.lookAt(this.center.x, this.center.y, this.center.z); //指向中国地图的几何中心
            this.controls.update();// update()函数内会执行camera.lookAt(controls.target)
        }, _ => _, console.log)
    }


    parsePolygons(coordinates: any[], index: number) {
        const areaArr: Coordinate[][] = []
        coordinates.forEach((item) => { // 这一层如果有多个说明一个区域有多个图形组成（比如（中国的省份）有大陆、台湾、以及多个不相交的群岛组成）
            const areaItemArr: Coordinate[][] = []
            item.forEach((polygon: Coordinate[]) => { // 这一层是每一个区域地图的图形坐标
                areaItemArr.push(polygon)
            })
            areaArr.push(...areaItemArr)
        })
        return areaArr;
    }


}
