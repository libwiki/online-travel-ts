import {AxesHelper, GridHelper} from "three";
import Component from "/@/hooks/three3d/lib/abstracts/Component";
import BaseThree3DMap from "/@/hooks/three3d/lib/abstracts/BaseThree3DMap";

export default class Helpers extends Component {
    axesHelper: AxesHelper
    gridHelper: GridHelper

    constructor(map: BaseThree3DMap) {
        super(map)

        //three.js辅助坐标系
        const axesHelper = new AxesHelper(10);
        this.axesHelper = axesHelper
        this.map.scene.add(axesHelper);

        const gridHelper = new GridHelper(10, 10);
        this.gridHelper = gridHelper
        this.gridHelper.rotateX(Math.PI / 2)
        this.map.scene.add(gridHelper);

    }

    onStart() {
        super.onStart();
    }

    onUpdate(): void {
        this.axesHelper.position.set(this.map.center.x, this.map.center.y, 0)
        this.gridHelper.position.set(this.map.center.x, this.map.center.y, 0)

    }
}
