import {Vector2, Vector3} from "/@/hooks/freeDo/lib/types/Vector";

// 飞渡的一个标记点的数据结构
export interface IFreeMarkerOption {
    pid: string // 唯一id
    name: string // 名称
    point: Vector3 | Vector2, // Vector2时为世界经纬度坐标，需要转换 [0,0,0]|[0,0]
    iconSize?: Vector2
    lookAtPoint?: IFreeCameraFrame // 镜头切换时
    sort?: number
}

// 飞渡的相机画面帧
// x: number, y: number, z: number, distance: number, pitch: number, yaw: number, flyTime?: number
export type IFreeCameraFrame = [number, number, number, number, number, number, number?]
