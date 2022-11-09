import {IAirCityPlayer} from "/@/hooks/freeDo/lib/types/AirCityPlayer";
import {IAirCityAPI, IComponent} from "/@/hooks/freeDo/lib/Interfaces";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";

export default class FreeDo {
    protected _domId: string
    protected _airCityPlayer?: IAirCityPlayer
    protected __g?: IAirCityAPI
    components: IComponent[] = []; // 组件

    get g() {
        return this.__g
    }

    get airCityPlayer() {
        return this._airCityPlayer
    }

    constructor(domId: string) {
        this._domId = domId;
    }

    onStart(): void {
        const dtsOption = {
            // 云渲染实例的ID，该属性有以下两种情况：
            // 1、对于带视频流的连接，该属性是可选的，如果没有指定iid，则自动分配空闲的实例
            // 2、对于不带视频流的API调用，该属性是必需的，必需指定云渲染实例才能进行API调用
            iid: '2482846585653',
            // 工程ID
            pid: 17,
            // 必选参数，网页显示视频流的domId
            domId: this._domId,
            // 必选参数，二次开发时必须指定，否则无法进行二次开发
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
        const airCityPlayer = new window.AirCityPlayer("192.168.58.1:8080", dtsOption)
        this._airCityPlayer = airCityPlayer
        this.__g = airCityPlayer.getAPI()
        console.log(this.airCityPlayer, this.g)
        window.onresize = () => {
            airCityPlayer.resize()
        }

        this.components.forEach(v => v.onStart())
    }

    onReady(): void {
        console.log('onReady')
        this.components.forEach(v => v.onReady())
    }

    onDispose(reason = '自动关闭'): void {
        console.log('onDispose')
        this.components.forEach(v => v.onDispose())
        this._airCityPlayer?.destroy(reason)
    }

    onEvent(event: IAirCityEvents): void {
        console.log('event', event)
        this.components.forEach(v => v.onEvent(event))

    }


}
