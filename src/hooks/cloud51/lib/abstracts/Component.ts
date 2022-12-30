import {I51CloudEventsOption} from "/@/hooks/cloud51/lib/types/Events";
import {IComponent} from "/@/hooks/cloud51/lib/Interfaces";
import {Cloud51} from "/@/hooks/cloud51/Cloud51";

export default class Component implements IComponent {
    name?: string
    cloud: Cloud51

    constructor(cloud: Cloud51, name?: string) {
        this.name = name
        this.cloud = cloud
    }

    onStart(): void {
    }

    onReady(): void {
    }

    onEvent(event: I51CloudEventsOption): void {
    }

    onUpdate(deltaTime: number): void {
    }

    async onDispose(): Promise<any> {
    }

}
