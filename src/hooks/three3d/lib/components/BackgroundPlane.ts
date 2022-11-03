import Component from "/@/hooks/three3d/lib/abstracts/Component";
import * as Three from "three";
import {getCenterByBox3, getSizeByBox3} from "/@/hooks/three3d/lib/utils";

interface ITorusOption {
    radius: number,  // 环面的半径
    name?: string,
    tube?: number, // 管道的半径 默认：0.4
    radialSegments?: number,  // 管道横截面的分段数 默认：8
    tubularSegments?: number,  // 管道的分段数 默认：16
    arc?: number, // 圆环的圆心角 默认：Math.PI
    color?: Three.Color,
    center?: Three.Vector3,
}

export default class BackgroundPlane extends Component {
    backgroundPlaneGroup = new Three.Group()

    lambertMaterial = new Three.MeshLambertMaterial({
        // color: 0x004444,
        color: 0xffffff,
        // opacity: 0.8,
        // bumpScale: 1, // 凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。
        // roughness: 1, // 材质的粗糙程度。0.0表示平滑的镜面反射
        // metalness: 0.0, // 材质与金属的相似度
        // side: DoubleSide, //两面可见
    }); // 形状材质对象
    onReady() {
        super.onReady();
        this.backgroundPlaneGroup.name = 'backgroundPlaneGroup'
        this.drawBackgroundPlane(this.map.mapBox3)
        const torusOption: ITorusOption = {
            radius: this.map.maxMapAxisValue / 2,
            tube: this.map.maxMapAxisValue / 1000,
            radialSegments: 8,
            tubularSegments: 100,
            arc: Math.PI * 2,
            color: new Three.Color(0xa2bbc1)
        }
        this.drawBackgroundTorus(torusOption)
        torusOption.radius *= 1.4
        this.drawBackgroundTorus(torusOption)
        this.map.scene.background = new Three.Color(0xd0e9fb)
        this.map.mapGroup.add(this.backgroundPlaneGroup)
    }

    // 生成背景图
    drawBackgroundPlane(box3: Three.Box3, multiply: number = 2.5, name = '') {
        const size = getSizeByBox3(box3).multiply(new Three.Vector3(multiply, multiply, multiply))
        const center = getCenterByBox3(box3)
        const textureUrl = `/geojson/dahua/texture/bg.png`;
        const texture = this.map.loadTexture(textureUrl)
        texture.wrapS = Three.RepeatWrapping;
        texture.wrapT = Three.RepeatWrapping;
        const material = this.lambertMaterial.clone();
        material.map = texture
        material.transparent = true
        const geometry = new Three.PlaneGeometry(size.x, size.y); //默认在XOY平面上
        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(center.x, center.y, 0);//设置mesh位置
        mesh.name = name
        mesh.receiveShadow = this.map.debug.castShadow || false

        this.backgroundPlaneGroup.add(mesh)
    }

    // 生成圆环
    drawBackgroundTorus(option: ITorusOption) {
        const geometry = new Three.TorusGeometry(option.radius, option.tube, option.radialSegments, option.tubularSegments, option.arc);
        const material = this.lambertMaterial.clone();
        if (option.color) {
            material.color = option.color
        }
        material.side = Three.DoubleSide
        const mesh = new Three.Mesh(geometry, material);
        mesh.name = option.name || ''
        mesh.position.copy(option.center || this.map.center)
        this.backgroundPlaneGroup.add(mesh)
    }
}
