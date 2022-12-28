import {IThree3DMapRenderGeoJsonOption} from "/@/hooks/three3d/lib/Interfaces";
import BaseThree3DMap from "/@/hooks/three3d/lib/abstracts/BaseThree3DMap";
import * as Three from "three";

const MaxTryRunning = 5;
export default class Three3DMap extends BaseThree3DMap {
    private tryRunning = 0;

    async onRenderByGeoJson(option: IThree3DMapRenderGeoJsonOption) {
        this.geoJsonOption = option;
        if (this.isRunning) { // 当前正在运行中
            this.onDispose(); // 先卸载旧地图，下一帧重新启动
            if (this.tryRunning >= MaxTryRunning) {
                throw new Error("程序已经进入了死循环，大部分情况为自行控制【isRunning】状态引起的，请查验逻辑！")
            }
            requestAnimationFrame(() => {
                this.tryRunning++
                this.onRenderByGeoJson(option); // 重新启动
            })
            return
        } else { // 当前已经停止,需要重新启动帧刷新
            this.tryRunning = 0;
            this.isRunning = true
        }
        try {
            const results = await Promise.all([
                this.loadGeoJsonFileAsync(option.areaGeoJsonUrl),
                this.loadGeoJsonFileAsync(option.borderlineGeoJsonUrl),
            ])
            if (results[0] === false) {
                throw new Error('加载区域边界线失败')
            }
            this.areaFeatureObjects = results[0];
            if (results[1] !== false) {
                this.borderlineFeatureObjects = results[1];
            }
            this.onReady(); // 需要先执行MapLayer组件后方可获取到实际的center和mapSize
            this.camera.position.set(this.center.x, this.center.y, this.maxMapAxisValue * 2); //沿着z轴观察
            // console.log(this.mapBox3)
            // this.camera.position.copy(new Three.Vector3(
            //     this.mapBox3.max.x,
            //     this.mapBox3.max.y,
            //     this.maxMapAxisValue,
            // ))
            this.controls.target.set(this.center.x, this.center.y, this.controls.target.z);
            // this.camera.lookAt(this.center.x, this.center.y, this.center.z); //指向中国地图的几何中心
            this.controls.update();// update()函数内会执行camera.lookAt(controls.target)
        } catch (e) {
            console.log('加载GeoJson文件失败', e)
        }
    }
}
