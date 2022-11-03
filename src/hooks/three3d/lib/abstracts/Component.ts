import {IComponent} from "/@/hooks/three3d/lib/Interfaces";
import BaseThree3DMap from "/@/hooks/three3d/lib/abstracts/BaseThree3DMap";

export default class Component implements IComponent {
    name: string
    map: BaseThree3DMap

    constructor(map: BaseThree3DMap, name: string = '') {
        this.map = map
        this.name = name
    }

    onStart(): void {
    }

    onReady(): void {
    }

    onUpdate(deltaTime:number): void {
    }

    onDispose(): void {
    }

}
