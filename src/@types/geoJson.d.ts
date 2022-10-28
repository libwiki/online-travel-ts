export interface IGeoJson {
    type: string,
    features: IGeoFeature[],
}


export interface IGeoFeature<T> {
    type: string,
    properties: Partial<T>,
    geometry: IGeometry
}

export interface IGeometry {
    type: string,
    coordinates: Coordinate[][]
}

export type Coordinate = [number, number]


