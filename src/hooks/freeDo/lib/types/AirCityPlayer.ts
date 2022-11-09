// http://sdk.g-bim.cn/doc/api/AirCityPlayer.html
import {IAirCityAPI, IAirCityApiOption} from "/@/hooks/freeDo/lib/Interfaces";
import {Vector2} from "/@/hooks/freeDo/lib/types/Vector";

export interface IAirCityPlayer {
    constructor(host: string, params: IAirCityPlayerOption): this

    // 获取AirCityAPI接口
    getAPI(): IAirCityAPI

    // 获取服务器的地址（ip:port）
    getHost(): string

    // 获取当前所连接的实例信息
    getInstanceInfo(): any

    // 获取视频流的尺寸
    getVideoSize(): Vector2

    // 重新调整布局
    resize(): void

    // 设置最大码率，单位kbps
    setBitrate(maxBitrate: number): void

    // 设置实例选项，调用此接口可以实现在不刷新页面的情况下切换使用的实例或工程文件
    setInstanceOptions(options: { iid?: string, pid?: string }): boolean

    // 设置键盘交互事件的接收者
    setKeyEventReceiver(newVal: KeyEventReceiverEnum): void

    // 设置视频流的尺寸，如果云渲染后台启用了自适应，那么视频流的分辨率也会自动调整。 如果没有启用自适应，则调用不起作用。
    setResolution(width: number, height: number): void

    // 销毁
    destroy(reason: string): void
}



export interface IAirCityPlayerOption {
    iid: string // 云渲染实例的ID
    pid: number // 工程ID
    domId?: string // HTML页面中的元素ID 如果未设置此参数，则不传输视频流，只进行API调用
    // 如果只是展示视频流，不需要进行接口调用，可以不指定该选项。
    // 如果指定了apiOptions，在初始化AirCityPlayer的时候会自动创建AirCityAPI对象，后面可以通过
    // getAPI()方法返回创建的AirCityAPI对象。
    apiOptions?: IAirCityApiOption
    // 参数类型：object 或者 boolean
    // 控制是否在左下角出现“显示信息”的按钮（默认不显示，如果要显示，请设置该参数）。
    // 当点击“显示信息”时，会在小窗口显示当前连接的实时运行状态；当鼠标移动到“显示信息”上停留片刻时，会显示当前所连接的实例的详细信息（主机、工程、实例ID等）
    // 如果参数类型为object，可以有以下属性：
    // 1、showSettings (boolean) 是否显示参数设置
    // 2、showLatencyTest (boolean) 是否显示延迟测试（只支持chrome浏览器）
    showMarker?: boolean | any
    showStartupInfo?: boolean // 控制是否在初始化过程中显示详细信息，默认值为true
    onloaded?: (event: any) => void // 当视频流加载成功后触发
    onclose?: (event: any) => void // 当与信令服务的连接断开的回调函数，函数参数为event（断开事件）
    keyEventReceiver?: KeyEventReceiverEnum // 设置实例的访问令牌，如果服务设置了令牌，那么客户端需要提供正确的令牌才能连接实例
    token?: string // 设置实例的访问令牌，如果服务设置了令牌，那么客户端需要提供正确的令牌才能连接实例
    urlExtraInfo?: any // 用于给WebSocket连接的URL添加附加信息（例如认证授权信息等）
    useBuiltinCursor?: boolean // 设置是否使用内置光标，如果设置为false, 则不使用内置光标，视频窗口将一直显示箭头样式的光标
}

export enum KeyEventReceiverEnum {
    document = 'document',
    video = 'video',
    none = 'none',
}

