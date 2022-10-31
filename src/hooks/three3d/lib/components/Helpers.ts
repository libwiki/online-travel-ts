import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import {AxesHelper, GridHelper} from "three";
import {IComponent} from "/@/hooks/three3d/lib/Interfaces";

export default class Helpers implements IComponent {
    map: Three3DMap
    axesHelper: AxesHelper
    gridHelper: GridHelper

    constructor(map: Three3DMap) {
        this.map = map

        //three.js辅助坐标系
        const axesHelper = new AxesHelper(10);
        this.axesHelper = axesHelper
        this.map.scene.add(axesHelper);

        const gridHelper = new GridHelper(10, 10);
        this.gridHelper = gridHelper
        this.gridHelper.rotateX(Math.PI / 2)
        this.map.scene.add(gridHelper);

    }

    onUpdate(): void {
        this.axesHelper.position.set(this.map.center.x, this.map.center.y, 0)
        this.gridHelper.position.set(this.map.center.x, this.map.center.y, 0)

    }
}
