import {Vector3} from "/@/hooks/freeDo/lib/types/Vector";

export interface IAirCityEvents {
    eventtype: string // 例："LeftMouseButtonClick"
    ObjectID: string // 例："Landscape_0"
    Type: string // 例："TileLayer"
    PropertyName: string // 例："GX_KT_Scene"
    Id: string // 例："3681038C46C12DC4A77482A259935580"
    MouseClickPoint: Vector3
    BoundsMin: Vector3,
    BoundsMax: Vector3
}
