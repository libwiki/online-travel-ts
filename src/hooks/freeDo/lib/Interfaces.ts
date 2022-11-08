import {ICamera} from "/@/hooks/freeDo/lib/types/Camera";
import {ICoord} from "/@/hooks/freeDo/lib/types/Coord";

export interface IAirCityAPI {
    camera: ICamera
    coord: ICoord
}

export interface IComponent {
    onStart(): void // 开始
    onReady(): void // 数据准备就绪
    onUpdate(deltaTime: number): void // 每一帧
    onDispose(): void // 组件卸载
}
