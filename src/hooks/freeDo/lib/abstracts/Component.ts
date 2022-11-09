import {IComponent} from "/@/hooks/freeDo/lib/Interfaces";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";
import FreeDo from "/@/hooks/freeDo/FreeDo";

export default class Component implements IComponent {
    name?: string
    freeDo: FreeDo

    constructor(freeDo: FreeDo, name?: string) {
        this.name = name
        this.freeDo = freeDo
    }

    onDispose(): void {
    }

    onEvent(event: IAirCityEvents): void {
    }

    onReady(): void {
    }

    onStart(): void {
    }

}
