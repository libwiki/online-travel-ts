import {IAirCityPlayer, IAirCityPlayerOption} from "/@/hooks/freeDo/lib/types/AirCityPlayer";
import {IAirCityAPI, IComponent} from "/@/hooks/freeDo/lib/Interfaces";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";
import {ICloudOption} from "/@/@types/config";
import {IFreeCameraFrame, toIFreeCameraFrame} from "/@/@types/markerOption";
import mitt from "mitt";

// 标签组件的事件（轮播事件）
export enum FreeDoEvents {
    onReady = "onReady",
    onEvent = "onEvent",
    onUpdate = "onUpdate",
    onDispose = "onDispose",
}

interface ITest {
    name: string
}

class TestClass<T extends ITest>{
    test1(name: string): ITest {
        return {name};
    }

    test2(name: string): T {
        return {name};
    }
}

type MarkerEventType = {
    [k in FreeDoEvents]: any
}

export class FreeDo {
    protected _domId?: string
    protected _host: string
    protected _option: ICloudOption
    emitter = mitt<MarkerEventType>()
    protected _running = false

    protected _airCityPlayer?: IAirCityPlayer
    protected __g?: IAirCityAPI
    components: IComponent[] = []; // 组件

    get g() {
        return this.__g
    }

    get host() {
        return this._host
    }

    set host(host: string) {
        this._host = host
    }

    get option() {
        return this._option
    }

    set option(option: ICloudOption) {
        this._option = option
    }

    set domId(domId: string) {
        this._domId = domId
    }

    get sceneName() {
        return this.option.name
    }

    get airCityPlayer() {
        return this._airCityPlayer
    }

    constructor(host: string, option: ICloudOption, domId?: string) {
        this._domId = domId;
        this._host = host;
        this._option = option;
    }

    get isRunning() {
        return this._running
    }

    // 正在启动 （false时将停止onUpdate的帧刷新）
    set isRunning(val: boolean) {
        const oldVal = this._running
        this._running = val
        if (val && val !== oldVal) { // 重新启动
            this.onUpdate(Date.now())
        }

    }

    getComponentByName<T extends IComponent>(name: string): T | void {
        return this.components.find(v => v.name === name) as any;
    }


    // 还原回到起始镜头
    onResetCameraFrame() {
        this.lookAt(toIFreeCameraFrame(this.option.point))
    }

    async lookAt(lookAtPoint?: IFreeCameraFrame) {
        if (!lookAtPoint) {
            return
        }
        return this.g?.camera.lookAt(
            lookAtPoint.x,
            lookAtPoint.y,
            lookAtPoint.z,
            lookAtPoint.distance,
            lookAtPoint.pitch,
            lookAtPoint.yaw,
            lookAtPoint.flyTime || 0
        )
    }

    onStart(): void {
        const dtsOption: IAirCityPlayerOption = {
            iid: this.option.iid,
            // 工程ID
            pid: this.option.dtsPid,
            // 必选参数，网页显示视频流的domId
            domId: this._domId,
            apiOptions: {
                // 必选参数，与云渲染主机通信成功后的回调函数
                // 注意：只有在onReady之后才可以调用AirCityAPI接口
                onReady: this.onReady.bind(this),
                // 可选参数，日志输出回调函数
                // onLog: this.onLog,
                // 可选参数，日志颜色，默认关闭
                useColorLog: true
            }
        }
        if (this._domId) {
            dtsOption.domId = this._domId;
            // 可选参数，三维场景交互事件回调函数
            dtsOption.apiOptions.onEvent = this.onEvent.bind(this);
        }
        const airCityPlayer = new window.AirCityPlayer(this._host, dtsOption)
        this._airCityPlayer = airCityPlayer
        this.__g = airCityPlayer.getAPI()
        window.onresize = () => {
            airCityPlayer.resize()
        }

        this.components.forEach(v => v.onStart())
    }

    onReady(): void {
        this.components.forEach(v => v.onReady())
        this.isRunning = true
        this.emitter.emit(FreeDoEvents.onReady)
    }

    onUpdate(deltaTime: number): void {
        if (this.isRunning) { // 是否正在启动
            this.components.forEach(v => v.onUpdate(deltaTime))
            requestAnimationFrame(() => {
                this.onUpdate(Date.now())
            });
            this.emitter.emit(FreeDoEvents.onUpdate, deltaTime)
        }
    }

    async onDispose(reason = '页面卸载，自动关闭') {
        this.isRunning = false
        await Promise.all(this.components.map(v => v.onDispose()))
        await this.g?.reset() // 重置场景
        await this.g?.destroy()
        await this._airCityPlayer?.destroy(reason)
        this.emitter.emit(FreeDoEvents.onDispose)
    }

    onEvent(event: IAirCityEvents): void {
        console.log('event', event)
        this.components.forEach(v => v.onEvent(event))
        this.emitter.emit(FreeDoEvents.onEvent, event)
    }


}
