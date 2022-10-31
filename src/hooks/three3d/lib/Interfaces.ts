import {Coordinate} from "/@/@types/geoJson";
import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";

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


export class Component implements IComponent {
    map: Three3DMap

    constructor(map: Three3DMap) {
        this.map = map
    }

    onDispose(): void {
    }

    onReady(): void {
    }

    onStart(): void {
    }

    onUpdate(): void {
    }

}
