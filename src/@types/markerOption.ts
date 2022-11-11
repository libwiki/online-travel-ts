import {Vector2, Vector3} from "/@/hooks/freeDo/lib/types/Vector";

// 飞渡的一个标记点的数据结构
export interface IFreeMarkerOption {
    pid: string
    name: string
    point: Vector3 | Vector2, // Vector2时为世界经纬度坐标，需要转换
    iconSize?: Vector2
    lookAtPoint?: IFreeCameraFrame
    sort?: number
}

// 飞渡的相机画面帧
// x: number, y: number, z: number, distance: number, pitch: number, yaw: number, flyTime?: number
export type IFreeCameraFrame = [number, number, number, number, number, number, number?]
