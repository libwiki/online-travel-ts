import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {createApp} from "vue";
import Marker from "./Marker.vue"
import {CSS3DSprite} from "three/examples/jsm/renderers/CSS3DRenderer";
import {Object3D, Vector3} from "three";
import {ITagProps} from "/@/hooks/three3d/lib/htmlComponents/tags/interfaces";
import {IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";

export default class Tag extends Component {
    object3d?: Object3D
    tagInstance?: any
    position?: Vector3
    userData?: IFeatureProperties


    onRender(position?: Vector3, userData?: IFeatureProperties) {
        this.setPosition(position)
        const mountNode = document.createElement('div')
        document.body.appendChild(mountNode)
        const app = createApp(Marker);
        const tagInstance = app.mount(mountNode);
        this.tagInstance = tagInstance
        const object3d = new CSS3DSprite(tagInstance.$el)
        object3d.name = this.name
        object3d.up.copy(this.map.camera.up)
        object3d.scale.copy(new Vector3(0.003, 0.003, 1))
        object3d.position.copy(this.getPosition())
        this.object3d = object3d
        this.setUserData(userData)
        this.map.scene.add(this.object3d)

    }

    setData(data: ITagProps) {
        this.tagInstance?.setProps(data)
    }

    getPosition() {
        if (this.position) {
            return this.position
        }
        return this.map.center
    }

    setPosition(position?: Vector3) {
        this.position = position
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
        if (this.object3d) {
            if (show && !this.object3d.parent) {
                this.map.scene.add(this.object3d)
            }
            this.object3d.visible = show
        }
    }


    onUpdate() {
        this.object3d?.position.copy(this.getPosition())
    }
}
