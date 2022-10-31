import {AmbientLight, DirectionalLight, PointLight} from "three";
import Component from "/@/hooks/three3d/lib/abstracts/Component";
import BaseThree3DMap from "/@/hooks/three3d/lib/abstracts/BaseThree3DMap";

export default class Lights extends Component {

    constructor(map: BaseThree3DMap) {
        super(map)
        const light = new AmbientLight(0xffffff); // soft white light
        // this.map.scene.add(light);

        const directionalLight = new DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 0, 10);
        // const directionalLightHelper = new DirectionalLightHelper(directionalLight, 4);
        // scene.add(directionalLightHelper);
        this.map.scene.add(directionalLight)
        const pointLight = new PointLight(0xffffff, 0.6);
        pointLight.position.set(-5, 0, 10);
        this.map.scene.add(pointLight);
    }

}
