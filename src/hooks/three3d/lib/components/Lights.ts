import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import {DirectionalLight, PointLight} from "three";
import {IComponent} from "/@/hooks/three3d/lib/components/IComponent";

export default class Lights implements IComponent {
    map: Three3DMap

    constructor(map: Three3DMap) {
        this.map = map

        const directionalLight = new DirectionalLight(0xffffff, 1)
        directionalLight.position.set(4, 0, 2);
        // const directionalLightHelper = new DirectionalLightHelper(directionalLight, 4);
        // scene.add(directionalLightHelper);
        this.map.scene.add(directionalLight)
        const pointLight = new PointLight(0xffffff, 0.6);
        pointLight.position.set(-4, 0, 2);
        this.map.scene.add(pointLight);
    }

    onUpdate(): void {
    }
}
