import {ICommandResult} from "/@/hooks/freeDo/lib/types/BaseObject";
import {Vector2, Vector3} from "/@/hooks/freeDo/lib/types/Vector";

// http://sdk.g-bim.cn/doc/api/Coord.html
export interface ICoord {
    // 地理坐标转投影坐标
    gcs2pcs<T extends Vector2 | Vector3>(coordinates: T | T[], fn?: Function): Promise<ICoordResult<T>>

    // 投影坐标转地理坐标
    pcs2gcs<T extends Vector2 | Vector3>(coordinates: T | T[], fn?: Function): Promise<ICoordResult<T>>

    // 屏幕坐标转为世界坐标（这个接口转换的有问题）
    screen2World(x: number, y: number, fn?: Function): Promise<IWorldResult>

    // 世界坐标转为屏幕坐标
    world2Screen(x: number, y: number, z: number, fn?: Function): Promise<IScreenResult>


}


export interface ICoordResult<T extends Vector2 | Vector3> extends ICommandResult {
    coordinates: T[]
}

export interface IWorldResult extends ICommandResult {
    worldLocation: Vector3
}

export interface IScreenResult extends ICommandResult {
    screenPosition: Vector2
}
