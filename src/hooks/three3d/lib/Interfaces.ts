import {Coordinate} from "/@/@types/geoJson";

export interface IComponent {
    onStart(): void // 开始
    onReady(): void // 数据准备就绪
    onUpdate(): void // 每一次更新
    onDispose(): void // 组件卸载
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

