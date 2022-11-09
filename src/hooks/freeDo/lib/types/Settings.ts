import {Vector2} from "/@/hooks/freeDo/lib/types/Vector";
import {Colors, CoordinateTypeEnum} from "/@/hooks/freeDo/lib/types/Marker";

// http://sdk.g-bim.cn/doc/api/Settings.html
export interface ISettings {
    // 获取地图样式
    getMapMode(fn?: Function): Promise<IMapStyle>

    setMapMode(mode: MapModeEnum, options: any, fn?: Function): Promise<any>

    // 设置指北针可见性
    setCampassVisible(visible: boolean, fn?: Function): Promise<any>

    // 设置主界面UI元素的可见性
    setMainUIVisibility(visible: boolean, fn?: Function): Promise<any>

    // 设置是否触发CameraMoving事件，CameraMoving事件默认是关闭的，如果需要接收相机移动消息，可以调用此方法
    setEnableCameraMovingEvent(enable: boolean, fn?: Function): Promise<any>

    // 设置交互开关，目前支持启用和禁用鼠标交互，禁用后可以通过API设置交互
    setEnableInteract(enable: boolean, fn?: Function): Promise<any>

    // 设置交互模式
    setInteractiveMode(mode?: InteractiveModeEnum, fn?: Function): Promise<any>

    // 设置水平视场角  取值范围：[-360~360] 单位：度
    setFovX(deg: number, fn?: Function): Promise<any>

    // 设置高亮颜色
    setHighlightColor(color: Colors, fn?: Function): Promise<any>
}

export enum InteractiveModeEnum {
    Free,// 0：自由交互模式，
    ThirdPerson,// 1：第三人称模式，
    UAV,// 2：无人机模式，
    Center_Walk,// 3：中心漫游模式（物体观察模式），
    Map,// 4：地图模式
}

// http://sdk.g-bim.cn/doc/api/global.html#MapMode
export enum MapModeEnum {
    Campass, // 指南针
    SmallMap, // 小地图
    BigMap, // 指南针
}


export interface IMapStyle {
    mode: MapModeEnum, // 地图样式，0：指南针；1：小地图；2：大地图，参见MapMode
    coordType: CoordinateTypeEnum, //坐标系类型，0：经纬度；1：本地（默认值是0）
    mapPoint: Vector2, //同名点，取值范围：[x,y]，（默认值是[0, 0]）
    longitude: number,//经度，取值范围：[0~180]（默认值是0.0）
    latitude: number,//取值范围：[0~90]（默认值是0.0）
    cache: string,//缓存路径，字符串地址，（默认值是 :memory:）
    style: string,//风格路径，字符串地址，（默认值是 mapbox://styles/mapbox/streets-v10）
    serverURL: any,//WMTS风格路径，二维数组，参考setMapMode参数说明
    groundHeight: number,//地面高度，取值范围：[0~任意数值]（默认值是0.0）
    renderMode: number, //渲染模式，0：正常；1：透明；2：标注；3：贴地（默认值是0）
    coordOrder: number, //坐标顺序，0: XY; 1: YX，默认值：0
    maxLevel: number // WMTS服务最大显示层级，取值范围：[0~22]，默认值：10
}
