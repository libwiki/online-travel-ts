import {Camera} from "three";
// @ts-ignore
import {MyMapControls} from "./MyOrbitControls.js"


export default class MyControls extends MyMapControls {
    constructor(camera: Camera, domElement: HTMLElement) {
        super(camera, domElement);
    }

}
