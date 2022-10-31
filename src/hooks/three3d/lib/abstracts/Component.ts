import {IComponent} from "/@/hooks/three3d/lib/Interfaces";
import BaseThree3DMap from "/@/hooks/three3d/lib/abstracts/BaseThree3DMap";

export default class Component implements IComponent {
    map: BaseThree3DMap

    constructor(map: BaseThree3DMap) {
        this.map = map
    }

    onStart(): void {
    }

    onReady(): void {
    }

    onUpdate(): void {
    }

    onDispose(): void {
    }

}
