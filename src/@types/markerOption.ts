import {Vector2, Vector3} from "/@/hooks/freeDo/lib/types/Vector";

// 飞渡的一个标记点的数据结构
export interface IFreeMarkerOption {
    pid: string // 唯一id
    name: string // 名称
    point: Vector3 | Vector2, // Vector2时为世界经纬度坐标，需要转换 [0,0,0]|[0,0]
    iconSize?: Vector2
    lookAtPoint?: FreeCameraFrame // 镜头切换时
    sort?: number
}

// 飞渡的相机画面帧
// x: number, y: number, z: number, distance: number, pitch: number, yaw: number, flyTime?: number
export type FreeCameraFrame = [number, number, number, number, number, number, number?]


export interface IFreeCameraFrame {
    x: number,
    y: number,
    z: number,
    distance: number,
    pitch: number,
    yaw: number,
    flyTime?: number
}

export function toIFreeCameraFrame(val: FreeCameraFrame | number[]): IFreeCameraFrame {
    return {
        x: val[0],
        y: val[1],
        z: val[2],
        distance: val[3],
        pitch: val[4],
        yaw: val[5],
        flyTime: val[6] || 0,
    }
}
