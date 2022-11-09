import {IAirCityPlayer, IAirCityPlayerOption} from "/@/hooks/freeDo/lib/types/AirCityPlayer";
import {IAirCityAPI, IComponent} from "/@/hooks/freeDo/lib/Interfaces";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";
import {ICloudOption} from "/@/@types/config";

export default class FreeDo {
    protected _domId: string
    protected _host: string
    protected _option: ICloudOption

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

    get airCityPlayer() {
        return this._airCityPlayer
    }

    constructor(domId: string, host: string, option: ICloudOption) {
        this._domId = domId;
        this._host = host;
        this._option = option;
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
                // 可选参数，三维场景交互事件回调函数
                onEvent: this.onEvent.bind(this),
                // 可选参数，日志颜色，默认关闭
                useColorLog: true
            }
        }
        const airCityPlayer = new window.AirCityPlayer(this._host, dtsOption)
        this._airCityPlayer = airCityPlayer
        this.__g = airCityPlayer.getAPI()
        console.log(this.airCityPlayer, this.g)
        window.onresize = () => {
            airCityPlayer.resize()
        }

        this.components.forEach(v => v.onStart())
    }

    onReady(): void {
        this.components.forEach(v => v.onReady())
    }

    onDispose(reason = '页面卸载，自动关闭'): void {
        this.components.forEach(v => v.onDispose())
        this.g?.reset() // 重置场景
        this._airCityPlayer?.destroy(reason)
    }

    onEvent(event: IAirCityEvents): void {
        console.log('event', event)
        this.components.forEach(v => v.onEvent(event))

    }


}
