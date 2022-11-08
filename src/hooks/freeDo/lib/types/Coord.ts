import {IAnimationImage} from "/@/hooks/freeDo/lib/types/Camera";

// http://sdk.g-bim.cn/doc/api/Coord.html
export interface ICoord {
    // 地理坐标转投影坐标
    gcs2pcs<T>(coordinates: T[], fn?: Function): Promise<T[]>

    // 投影坐标转地理坐标
    pcs2gcs<T>(coordinates: T[], fn?: Function): Promise<T[]>

    // 屏幕坐标转为世界坐标
    screen2World(x: number, y: number, fn?: Function): Promise<any>

    // 世界坐标转为屏幕坐标
    screen2World(x: number, y: number, z: number, fn?: Function): Promise<any>


}
