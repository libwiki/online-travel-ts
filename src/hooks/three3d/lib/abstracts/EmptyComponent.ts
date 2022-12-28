import {IComponent} from "/@/hooks/three3d/lib/Interfaces";

export default class EmptyComponent implements IComponent {
    onStart(): void {
    }

    onReady(): void {
    }

    onUpdate(deltaTime: number): void {


    }

    onDispose(): void {
    }
}
