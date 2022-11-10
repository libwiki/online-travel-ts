import {ICamera} from "/@/hooks/freeDo/lib/types/Camera";
import {ICoord} from "/@/hooks/freeDo/lib/types/Coord";
import {IMarker} from "/@/hooks/freeDo/lib/types/Marker";
import {ISettings} from "/@/hooks/freeDo/lib/types/Settings";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";
import {ICommandResult} from "/@/hooks/freeDo/lib/types/BaseObject";

export interface IAirCityAPI {
    camera: ICamera
    coord: ICoord
    marker: IMarker
    settings: ISettings

    // 获取SDK的完整版本号，例如：5.3.0413
    getVersion(): string

    // 关闭WebSocket连接
    destroy(): void

    // 初始化AirCityAPI的所有子类对象
    initInterface(): void

    // 初始化WebSocket
    initWebSocket(): void

    // 注册每帧渲染时要执行的JS脚本
    registerTick(url: string): void

    // 移除每帧渲染时执行的JS脚本
    removeTick(): void

    // 重置场景（重置到刚打开工程的状态）
    reset(fn?: Function): Promise<ICommandResult>

    // 设置三维事件（例如相机飞行开始、结束、Actor的点击等）的回调函数
    setEventCallback(fn: Function): void

    // 设置主机地址
    setHost(ip: string, port: number): void
}

export interface IComponent {
    onStart(): void // 开始
    onReady(): void // 数据准备就绪
    onEvent(event: IAirCityEvents): void //
    onUpdate(deltaTime: number): void // 每一次更新
    onDispose(): void // 组件卸载
}

export interface IAirCityApiOption {
    onReady?: Function // WebSocket连接建立成功的回调，此时可以调用接口了
    onLog?: Function // WebSocket连接建立成功的回调，此时可以调用接口了
    onEvent?: (event: IAirCityEvents) => void // 事件回调函数，也可以通过setEventCallback来设置
    onApiVersion?: Function // 回调函数，用于接收云渲染服务器的API版本信息（也可以通过misc.setApiVersionReceived来设置）
    useColorLog?: boolean // 仅用于SDK测试页面，二次开发请设置为false或者不设置
}
