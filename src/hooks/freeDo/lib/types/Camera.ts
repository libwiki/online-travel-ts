// http://sdk.g-bim.cn/doc/api/Camera.html
import {Vector3} from "/@/hooks/freeDo/lib/types/Vector";
import {ICommandResult} from "/@/hooks/freeDo/lib/types/BaseObject";

export interface ICamera {
    // 获取当前的相机位置
    get(fn?: (info: ICameraInfo) => void): Promise<ICameraInfo>

    // 设置相机位置
    set(x: number, y: number, z: number, pitch: number, yaw: number, flyTime?: number, fn?: Function): Promise<ICommandResult>

    // 根据导览名称获取对应导览缩略图的base64字符串
    getAnimationImage(name: string, fn?: (result: IAnimationImage) => void): Promise<IAnimationImage>

    // 获取当前acp里所有导览的信息
    getAnimationList(fn?: (results: IAnimationItem[]) => void): Promise<IAnimationItem[]>

    // 根据空间两点计算欧拉角
    getEulerAngle(startPoint: Vector3, endPoint: Vector3): EulerAngle

    // 设置相机位置
    lookAt(x: number, y: number, z: number, distance: number, pitch: number, yaw: number, flyTime?: number, fn?: Function): Promise<ICommandResult>

    lookAtBBox(bbox: number[], pitch: number, yaw: number, flyTime?: number, fn?: Function): Promise<ICommandResult>

    moveBackward(fn?: Function): Promise<ICommandResult>

    moveDown(fn?: Function): Promise<ICommandResult>

    moveForward(fn?: Function): Promise<ICommandResult>

    moveLeft(fn?: Function): Promise<ICommandResult>

    moveRight(fn?: Function): Promise<ICommandResult>

    moveUp(fn?: Function): Promise<ICommandResult>

    // 开始播放动画导航
    playAnimation(id: number, fn?: Function): Promise<ICommandResult>

    // 暂停播放动画导航
    pauseAnimation(fn?: Function): Promise<ICommandResult>

    // 恢复播放动画导航
    pauseAnimation(fn?: Function): Promise<ICommandResult>
}

// 相机位置
export interface ICameraInfo {
    x: number,
    y: number,
    z: number,
    pitch: number,
    yaw: number,
    roll: number,
    camera: [number, number, number, number, number],
}

// 导览缩略图的base64字符串
export interface IAnimationImage {
    image: string
}

// 导览的信息
export interface IAnimationItem {
    id: number,
    name: string,
}




// 欧拉角 Pitch,Yaw,Roll
export type EulerAngle = [number, number, number]
