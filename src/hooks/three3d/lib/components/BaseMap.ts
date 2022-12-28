import Component from "/@/hooks/three3d/lib/abstracts/Component";
import {IFeatureObject, IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import * as Three from "three";
import {getBox3ByObject3D, mergeBufferGeometries} from "/@/hooks/three3d/lib/utils";

/**
 * 底图
 * 实际上底图形状并不需要渲染
 * 该组件的组要作用是计算实际形状的包围盒Box3、以及渲染中心点center、渲染大小mapSize等
 */
export default class BaseMap extends Component {
    baseMapGroup = new Three.Group()

    onReady() {
        super.onReady();
        this.baseMapGroup.name = 'baseMapGroup'
        this.baseMapGroup.visible = false; // 实际上底图形状并不需要渲染
        this.generateBaseMap(this.map.borderlineFeatureObjects);
    }

    generateBaseMap(featureObjects: IFeatureObject[]) {
        featureObjects.forEach(item => { // 每一个区域
            const shapeGeos: Three.ShapeGeometry[] = []
            item.geometry.forEach(arr => {
                const vector2Arr: Three.Vector2[] = []
                arr.forEach((elem: any) => {
                    const v = this.map.mProjection(elem)
                    if (v) {
                        vector2Arr.push(new Three.Vector2(v[0], -v[1]))
                    }
                })
                shapeGeos.push(new Three.ShapeGeometry(new Three.Shape(vector2Arr)))
            })
            this.drawShareByGeometry(mergeBufferGeometries(shapeGeos), item.properties); // 生成边界面板以及区域附属对象
        })
        // 设置地图的整体box3盒子大小（内部会自动设置center和mapSize）
        this.map.mapBox3 = getBox3ByObject3D(this.baseMapGroup)
        // this.map.mapGroup.add(this.baseMapGroup) // 实际上底图形状并不需要渲染
    }

    // 生成边界面板以及附属对象
    drawShareByGeometry(geometry: Three.BufferGeometry, properties: IFeatureProperties) {
        const material = new Three.MeshBasicMaterial()
        const mesh = new Three.Mesh(geometry, material); //网格模型对象
        mesh.name = properties.name;
        mesh.userData = properties;
        this.baseMapGroup.add(mesh)
    }
}
