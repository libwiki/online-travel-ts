import {AxesHelper, GridHelper, Group} from "three";
import Component from "/@/hooks/three3d/lib/abstracts/Component";

// 调试助手 （网格平面、坐标轴等）
export default class Helpers extends Component {
    helpersGroup = new Group()

    onReady() {
        super.onReady();
        if (this.map.debug.axesDebug) { //three.js辅助坐标系
            const axesHelper = new AxesHelper(this.map.maxMapAxisValue * 3)
            axesHelper.position.set(this.map.center.x, this.map.center.y, 0)
            this.helpersGroup.add(axesHelper)
        }
        if (this.map.debug.gridDebug) { //three.js辅助坐标系
            const gridHelper = new GridHelper(this.map.maxMapAxisValue * 3);
            gridHelper.position.set(this.map.center.x, this.map.center.y, 0)
            gridHelper.rotateX(Math.PI / 2)
            this.helpersGroup.add(gridHelper)
        }
        if (this.helpersGroup.children.length > 0) {
            this.helpersGroup.name = 'helpersGroup'
            this.map.scene.add(this.helpersGroup);
        }

    }
}
