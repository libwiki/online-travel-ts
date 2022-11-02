import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {Raycaster, Vector2} from "three";

export default class RayCasters extends Component {
    rayCaster = new Raycaster();
    pointer = new Vector2();

    onPointerMove(event: PointerEvent) {
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        this.pointer.x = (event.clientX / this.map.size.x) * 2 - 1;
        this.pointer.y = -(event.clientY / this.map.size.y) * 2 + 1;
        this.onUpdate2()
    }

    onStart() {
        super.onStart();
        // 通过摄像机和鼠标位置更新射线
        this.map.el.addEventListener('pointermove', (e) => this.onPointerMove(e));
    }

    onUpdate2() {
        // super.onUpdate();
        this.rayCaster.setFromCamera(this.pointer, this.map.camera);
        // 计算物体和射线的焦点
        console.log(this.map.mapGroup)
        const intersects = this.rayCaster.intersectObjects<any>(this.map.mapGroup.children, false);
        if (intersects.length > 0) {
            console.log(intersects)
        }
        // for (let i = 0; i < intersects.length; i++) {
        //     intersects[i].object.material.color.set(0xff0000);
        // }
    }


}
