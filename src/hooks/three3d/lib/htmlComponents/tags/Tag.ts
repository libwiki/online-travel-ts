import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {createApp} from "vue";
import TagTemplate from "./TagTemplate.vue"
import {CSS3DSprite} from "three/examples/jsm/renderers/CSS3DRenderer";
import {Object3D, Vector3} from "three";

export default class Tag extends Component {
    object3d?: Object3D

    onStart() {
        super.onStart();
        const mountNode = document.createElement('div')
        document.body.appendChild(mountNode)
        const app = createApp(TagTemplate);
        const tagInstance = app.mount(mountNode);
        const object3d = new CSS3DSprite(tagInstance.$el)
        object3d.up.copy(this.map.camera.up)
        object3d.scale.copy(new Vector3(0.01, 0.01, 0.01))

        console.log('getBox3ByObject3D:::', this.map.mapSize)
        // object3d.lookAt(this.map.camera.up)
        // object3d.rotateX(Math.PI / 2)
        object3d.position.copy(this.map.center)
        this.object3d = object3d
        this.map.scene.add(object3d)
    }

    onUpdate() {
        super.onUpdate();
        this.object3d?.position.copy(this.map.center)
    }
}
