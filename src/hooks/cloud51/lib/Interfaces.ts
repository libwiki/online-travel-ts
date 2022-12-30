import {I51CloudEventsOption} from "/@/hooks/cloud51/lib/types/Events";

export interface IComponent {
    name?: string

    onStart(): void // 开始
    onReady(): void // 数据准备就绪
    onEvent(event: I51CloudEventsOption): void //
    onUpdate(deltaTime: number): void // 每一次更新
    onDispose(): Promise<any> // 组件卸载
}
