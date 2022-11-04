import {Coordinate} from "/@/@types/geoJson";

export interface IComponent {
    onStart(): void // 开始
    onReady(): void // 数据准备就绪
    onUpdate(deltaTime: number): void // 每一次更新
    onDispose(): void // 组件卸载
}


export interface IThree3DMapRenderGeoJsonOption {
    areaGeoJsonUrl: string, // 每一个区域的geoJsonUrl
    borderlineGeoJsonUrl: string, // 外围的边界线geoJsonUrl
}

export interface IThree3DMapDebug {
    lightDebug?: boolean, // 灯光调试
    gridDebug?: boolean, // 网格调试
    axesDebug?: boolean, // 坐标轴调试
    polarAngleDebug?: boolean, // 上下翻转调试（开启后无死角翻转）
    enablePan?: boolean, // 左右移动（开启后可拖动）
    castShadow?: boolean, // 开启阴影
}

export interface IFeatureProperties {
    name: string,
    city?: string,
    country?: string,
    province?: string,
}

export interface IFeatureObject {
    geometry: Coordinate[][], // [[[1, 3], [1, 3]]]
    properties: IFeatureProperties
}

// 射线组件的事件
export enum RayCasterEvents {
    pointermove = "pointermove",
    pointerdown = "pointerdown",
    pointerup = "pointerup",
    contextmenu = "contextmenu",
}


// 标签组件的事件
export enum TagEvents {
    onClick = "onClick", // 标签点击
}

