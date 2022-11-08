// http://sdk.g-bim.cn/doc/api/Camera.html
export interface ICamera {
    // 获取当前的相机位置
    get(fn?: (info: ICameraInfo) => void): Promise<ICameraInfo>

    // 设置相机位置
    set(x: number, y: number, z: number, pitch: number, yaw: number, flyTime?: number, fn?: Function): Promise<any>

    // 根据导览名称获取对应导览缩略图的base64字符串
    getAnimationImage(name: string, fn?: (result: IAnimationImage) => void): Promise<IAnimationImage>

    // 获取当前acp里所有导览的信息
    getAnimationList(fn?: (results: IAnimationItem[]) => void): Promise<IAnimationItem[]>

    // 根据空间两点计算欧拉角
    getEulerAngle(startPoint: Point, endPoint: Point): EulerAngle

    // 设置相机位置
    lookAt(x: number, y: number, z: number, distance: number, pitch: number, yaw: number, flyTime?: number, fn?: Function): Promise<any>

    lookAtBBox(bbox: number[], pitch: number, yaw: number, flyTime?: number, fn?: Function): Promise<any>

    moveBackward(fn?: Function): Promise<any>

    moveDown(fn?: Function): Promise<any>

    moveForward(fn?: Function): Promise<any>

    moveLeft(fn?: Function): Promise<any>

    moveRight(fn?: Function): Promise<any>

    moveUp(fn?: Function): Promise<any>

    // 开始播放动画导航
    playAnimation(id: number, fn?: Function): Promise<any>

    // 暂停播放动画导航
    pauseAnimation(fn?: Function): Promise<any>

    // 恢复播放动画导航
    pauseAnimation(fn?: Function): Promise<any>
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

// 坐标 x,y,z
export type Point = [number, number, number]

// 欧拉角 Pitch,Yaw,Roll
export type EulerAngle = [number, number, number]
