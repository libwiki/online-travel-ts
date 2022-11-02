import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {createApp} from "vue";
import Marker from "./Marker.vue"
import {CSS3DSprite} from "three/examples/jsm/renderers/CSS3DRenderer";
import {Object3D, Vector3} from "three";
import {ITagProps} from "/@/hooks/three3d/lib/htmlComponents/tags/interfaces";
import {IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";

const DEFAULT_SCALE_UNIT = 800
export default class Tag extends Component {
    object3d = new Object3D()
    tagInstance?: any
    _position?: Vector3
    userData?: IFeatureProperties
    scaleUnit = DEFAULT_SCALE_UNIT // 缩放单位


    onCreate(position?: Vector3, userData?: IFeatureProperties, scaleUnit = DEFAULT_SCALE_UNIT) {
        this.setPosition(position)
        this.setScaleUnit(scaleUnit)
        const mountNode = document.createElement('div')
        document.body.appendChild(mountNode)
        const app = createApp(Marker);
        const tagInstance = app.mount(mountNode);
        this.tagInstance = tagInstance
        const object3d = new CSS3DSprite(tagInstance.$el)
        object3d.name = this.name
        object3d.up.copy(this.map.camera.up)
        this.object3d = object3d
        this.setUserData(userData)
    }


    setData(data: ITagProps) {
        this.tagInstance?.setProps(data)
    }

    get position() {
        if (this._position) {
            return this._position
        }
        return this.map.center
    }

    get scale() {
        return new Vector3(this.map.minMapAxisValue / this.scaleUnit, this.map.minMapAxisValue / this.scaleUnit, 1)
    }

    setPosition(position?: Vector3) {
        this._position = position
    }

    setScaleUnit(scaleUnit = DEFAULT_SCALE_UNIT) {
        this.scaleUnit = scaleUnit
    }

    setUserData(userData?: IFeatureProperties) {
        this.userData = userData
        this.setData({
            text: userData?.name || ''
        })
        if (userData && this.object3d) {
            this.object3d.userData = userData
        }
    }

    onToggle(show: boolean) {
        if (show && !this.object3d.parent) {
            this.map.scene.add(this.object3d)
        }
        this.object3d.visible = show
    }


    onUpdate() {
        this.object3d.scale.copy(this.scale)
        this.object3d.position.copy(this.position)
    }
}
