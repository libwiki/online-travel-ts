import {IFreeCameraFrame, IFreeMarkerOption} from "/@/@types/markerOption";

export interface ICloudOption {
    name: string,

    title: string,
    // 区域编码
    areaCode: number,
    // 飞渡看板id
    kanBanId: number,
    // 飞渡工程实例id
    iid: string,
    // 飞渡工程id
    dtsPid: number,
    // 起始相机视角 地图起始坐标 x y z pitch yaw flyTime
    point: IFreeCameraFrame,
    // 标签聚焦时视角高度
    poiDistance: number,
    // 默认生成的标签点
    markers?: IFreeMarkerOption[],
}

export interface IFreeDoCloudRenderingOption {
    host: string, // 飞渡链连接地址
    defaultScene: string, // 默认的场景名称
    options: ICloudOption[],
}

export interface IConfigs {
    isDev: boolean
    cssVars: any
    StorageKeyPrefix: string, // 存贮key的前缀
    debug: boolean, // 是否开启debug
    baseUrl: string, // 请求的服务器api接口基础url
    jsonBaseUrl: string, // 请求的服务器json文件的接口基础url （实现多接口）
    version: string, // 当前版本号（暂未有实际用处）
    siteName: string, // 当前网站名称
    publicKey: string, // 加密公钥
    eChartsAnimationDurationUpdate: number, // eCharts数据更新频率
    updateDataTimeWheelInterval: number, // 时间轮间隔（数据更新的大定时器），应该是eCharts数据更新频率的整倍数，并且不能过小（因为每一次时间轮都有可能请求后台数据）
    // 飞渡云渲染平台配置
    freeDoCloudRendering: IFreeDoCloudRenderingOption
}
