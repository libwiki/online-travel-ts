import {Coordinate} from "/@/@types/geoJson";

export interface IComponent {
    onUpdate(): void
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

