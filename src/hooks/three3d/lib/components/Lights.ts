import {
    Color,
    DirectionalLight,
    DirectionalLightHelper,
    Group,
    Mesh,
    PointLight,
    PointLightHelper,
    SpotLight,
    SpotLightHelper,
    Vector3
} from "three";
import Component from "/@/hooks/three3d/lib/abstracts/Component";

export default class Lights extends Component {
    protected lightColor = new Color(0xffffff)
    protected lightGroup = new Group()

    onReady() {
        super.onReady();
        this.lightGroup.name = 'lightGroup'
        const pos = new Vector3(this.map.maxMapAxisValue, this.map.minMapAxisValue, this.map.maxMapAxisValue)
        this.generateSpotLight(pos.clone(), this.map.centerCube, 0.6)
        // this.generateDirectionalLight(pos.clone(), this.map.centerCube, 0.6)
        this.generatePointLight(pos.clone())
        const pos2 = pos.clone()
        pos2.setX(-this.map.minMapAxisValue)
        pos2.setY(-this.map.minMapAxisValue)
        this.generatePointLight(pos2)
        this.map.scene.add(this.lightGroup);
    }

    generateSpotLight(basePos: Vector3, target: Mesh, intensity: number = 1) {
        const light = new SpotLight(this.lightColor, intensity)
        const pos = basePos.add(this.map.center)
        light.position.copy(pos);
        light.target = target
        if (this.map.debug.lightDebug) {
            const helper = new SpotLightHelper(light, 1);
            this.lightGroup.add(helper);
        }
        this.lightGroup.add(light);
    }

    generateDirectionalLight(basePos: Vector3, target: Mesh, intensity: number = 1) {
        const light = new DirectionalLight(this.lightColor, intensity)
        const pos = basePos.add(this.map.center)
        light.position.copy(pos);
        light.target = target
        if (this.map.debug.lightDebug) {
            const helper = new DirectionalLightHelper(light, 1);
            this.lightGroup.add(helper);
        }
        this.lightGroup.add(light);
    }

    generatePointLight(basePos: Vector3, intensity: number = 0.5) {
        const light = new PointLight(this.lightColor, intensity)
        const pos = basePos.add(this.map.center)
        light.position.copy(pos);
        if (this.map.debug.lightDebug) {
            const helper = new PointLightHelper(light, 1);
            this.lightGroup.add(helper);
        }
        this.lightGroup.add(light);
    }

}
