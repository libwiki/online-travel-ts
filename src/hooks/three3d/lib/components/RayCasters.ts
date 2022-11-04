import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {Raycaster, Vector2} from "three";
import mitt from "mitt";
import {RayCasterEvents} from "/@/hooks/three3d/lib/Interfaces";

type RayCasterEventType = {
    [k in RayCasterEvents]: Raycaster
}
// 射线处理（处理模型的点击事件相关 注：html模型除外）
export default class RayCasters extends Component {
    emitter = mitt<RayCasterEventType>()
    pointermoveRayCaster = new Raycaster();
    pointerdownRayCaster = new Raycaster();
    pointerupRayCaster = new Raycaster();
    contextmenuRayCaster = new Raycaster();

    pointermovePointer = new Vector2();
    pointerdownPointer = new Vector2();
    pointerupPointer = new Vector2();
    contextmenuPointer = new Vector2();


    onPointer(event: MouseEvent, pointer: Vector2) {
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        pointer.set(
            (event.clientX / this.map.size.x) * 2 - 1,
            -(event.clientY / this.map.size.y) * 2 + 1
        )
        return pointer
    }

    onStart() {
        super.onStart();
        this.map.el.addEventListener(RayCasterEvents.pointermove, (e) => {
            this.onPointer(e, this.pointermovePointer)
            this.pointermoveRayCaster.setFromCamera(this.pointermovePointer, this.map.camera);
            this.emitter.emit(RayCasterEvents.pointermove, this.pointermoveRayCaster)
        });

        this.map.el.addEventListener(RayCasterEvents.pointerdown, (e) => {
            this.onPointer(e, this.pointerdownPointer)
            this.pointerdownRayCaster.setFromCamera(this.pointerdownPointer, this.map.camera);
            this.emitter.emit(RayCasterEvents.pointerdown, this.pointerdownRayCaster)
        });
        this.map.el.addEventListener(RayCasterEvents.pointerup, (e) => {
            this.onPointer(e, this.pointerupPointer)
            this.pointerupRayCaster.setFromCamera(this.pointerupPointer, this.map.camera);
            this.emitter.emit(RayCasterEvents.pointerup, this.pointerupRayCaster)
        });
        this.map.el.addEventListener(RayCasterEvents.contextmenu, (e) => {
            this.onPointer(e, this.contextmenuPointer)
            this.contextmenuRayCaster.setFromCamera(this.contextmenuPointer, this.map.camera);
            this.emitter.emit(RayCasterEvents.contextmenu, this.contextmenuRayCaster)
        });
    }


}
