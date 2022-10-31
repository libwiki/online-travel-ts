import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import * as Three from "three";
import {IFeatureObject, IFeatureProperties} from "/@/hooks/three3d/lib/Interfaces";
import BigNumber from "bignumber.js";
import {ToonShader1} from "three/examples/jsm/shaders/ToonShader";

export default class MapLayer {
    map: Three3DMap
    lineGroup = new Three.Group()
    extrudeShareGroup = new Three.Group()

    lineMaterial = new Three.LineBasicMaterial({
        color: 0x00cccc, //线条颜色
        // depthTest: false, // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)
    }); //线段材质对象
    shareMaterial = new Three.MeshStandardMaterial({
        // color: 0x004444,
        color: 0xffffff,
        // opacity: 0.8,
        // bumpScale: 1, // 凹凸贴图会对材质产生多大影响。典型范围是0-1。默认值为1。
        // roughness: 1, // 材质的粗糙程度。0.0表示平滑的镜面反射
        // metalness: 0.0, // 材质与金属的相似度
        // side: DoubleSide, //两面可见
    }); // 形状材质对象


    constructor(map: Three3DMap) {
        this.map = map
    }

    onRender() {
        this.generateMap(this.map.featureObjects)
        this.initBoxInfo();
    }

    initBoxInfo() {
        const box3 = this.getBox3ByObject3D(this.map.mapGroup)
        const size = this.getSizeByBox3(box3)
        const center = this.getCenterByBox3(box3)
        this.map.center = center
    }

    getBox3ByObject3D(object3D: Three.Object3D) {
        const box3 = new Three.Box3();//创建一个包围盒
        box3.expandByObject(object3D);
        return box3;
    }

    getSizeByBox3(box3: Three.Box3) {
        //scaleV3表示包围盒长宽高尺寸
        const size = new Three.Vector3();
        box3.getSize(size)
        // 查看控制台包围盒大小，辅助设置相机参数
        console.log('查看包围盒尺寸', size);
        return size
    }

    getCenterByBox3(box3: Three.Box3) {
        // 计算一个层级模型对应包围盒的几何体中心
        const center = new Three.Vector3();
        box3.getCenter(center);
        console.log('查看几何中心', center);
        return center
    }

    // 参考： https://blog.csdn.net/qq_37055675/article/details/120178475
    mergeBufferGeometries(objects: Three.BufferGeometry[]) {
        const sumPosArr = [];
        const sumNormArr = [];
        const sumUvArr = [];

        const modelGeometry = new Three.BufferGeometry();

        let sumPosCursor = 0;
        let sumNormCursor = 0;
        let sumUvCursor = 0;

        let startGroupCount = 0;
        let lastGroupCount = 0;

        for (let a = 0; a < objects.length; a++) {
            const posAttArr = objects[a].getAttribute('position').array;

            for (let b = 0; b < posAttArr.length; b++) {
                sumPosArr[b + sumPosCursor] = posAttArr[b];
            }

            sumPosCursor += posAttArr.length;


            const numAttArr = objects[a].getAttribute('normal').array;

            for (let b = 0; b < numAttArr.length; b++) {
                sumNormArr[b + sumNormCursor] = numAttArr[b];
            }

            sumNormCursor += numAttArr.length;


            const uvAttArr = objects[a].getAttribute('uv').array;

            for (let b = 0; b < uvAttArr.length; b++) {
                sumUvArr[b + sumUvCursor] = uvAttArr[b];
            }

            sumUvCursor += uvAttArr.length;

            const groupArr = objects[a].groups;

            for (let b = 0; b < groupArr.length; b++) {
                startGroupCount = lastGroupCount
                modelGeometry.addGroup(startGroupCount, groupArr[b].count, groupArr[b].materialIndex)
                lastGroupCount = startGroupCount + groupArr[b].count
            }
        }

        modelGeometry.setAttribute('position', new Three.Float32BufferAttribute(sumPosArr, 3));
        sumNormArr.length && modelGeometry.setAttribute('normal', new Three.Float32BufferAttribute(sumNormArr, 3));
        sumUvArr.length && modelGeometry.setAttribute('uv', new Three.Float32BufferAttribute(sumUvArr, 2));

        return modelGeometry
    }

    generateMap(featureObjects: IFeatureObject[], loop = true) {
        featureObjects.forEach(item => { // 每一个区域
            const lineGeos: Three.BufferGeometry[] = []
            const shapeGeos: Three.ExtrudeGeometry[] = []
            item.geometry.forEach(arr => {
                const vector2Arr: Three.Vector2[] = []
                const vector3Arr: Three.Vector3[] = []
                arr.forEach((elem: any) => {
                    const v = this.map.mProjection(elem)
                    if (v) {
                        vector2Arr.push(new Three.Vector2(v[0], -v[1]))
                        vector3Arr.push(new Three.Vector3(v[0], -v[1], 0.11))
                    }
                })
                shapeGeos.push(this.getExtrudeGeometry(new Three.Shape(vector2Arr)))
                lineGeos.push(this.getGeometryByPoints(vector3Arr))
                const geometry = this.getGeometryByPoints(vector3Arr);
                this.drawLine(vector3Arr, item.properties, loop)
            })
            const geo = this.mergeBufferGeometries(shapeGeos)
            this.drawExtrudeShareByGeometry(geo, item.properties)

            // const lineGeo = this.mergeBufferGeometries(lineGeos)
            // this.lineGroup.add(new Three.Line(lineGeo, this.lineMaterial));
            // this.drawExtrudeShareByGeometry(geo, item.properties)
        })
        this.map.mapGroup.add(this.extrudeShareGroup)
        this.map.mapGroup.add(this.lineGroup)
    }

    drawPlaneTextureByBox3(box3: Three.Box3, textureUrl: string, zOffset = 0, options: any = {}) {
        const texture = this.map.textureLoader.load(textureUrl)
        texture.wrapS = Three.RepeatWrapping;
        texture.wrapT = Three.RepeatWrapping;
        const material = new Three.MeshLambertMaterial({
            color: 0xffffff,//设置颜色
            // color: 0xff0000,//设置颜色
            map: texture,
            transparent: true, //使用背景透明的png贴图，注意开启透明计算
            depthTest: false, // 关闭深度测试(解决闪烁的问题，renderOrder等目前均出现些问题)
            // polygonOffset: true,
            // polygonOffsetUnits: 4,
            // polygonOffsetFactor: 0.41,
            // opacity: 0.5,
            // side: Three.DoubleSide, //双面可见
            ...options
        });
        const size = new Three.Vector3()
        const center = new Three.Vector3()
        box3.getSize(size)
        box3.getCenter(center)
        const geometry = new Three.PlaneGeometry(size.x, size.y); //默认在XOY平面上
        const mesh = new Three.Mesh(geometry, material);
        mesh.position.set(center.x, center.y, BigNumber(size.z).plus(zOffset).toNumber());//设置mesh位置
        // mesh.renderOrder = 100; // 设置贴图渲染排序（解决模型重合闪烁的问题）
        return mesh;
    }

    getGeometryByPoints(points: Three.Vector3[]) {
        return new Three.BufferGeometry().setFromPoints(points);
    }

    drawLine(points: Three.Vector3[], properties: IFeatureProperties, loop = true) {
        const geometry = this.getGeometryByPoints(points);
        if (loop) { //线条模型对象
            this.lineGroup.add(new Three.Line(geometry, this.lineMaterial));
        } else { //首尾顶点连线，轮廓闭合
            this.lineGroup.add(new Three.LineLoop(geometry, this.lineMaterial));
        }
    }

    drawExtrudeShareByGeometry(geometry: Three.BufferGeometry, properties: IFeatureProperties) {
        const material1 = this.shareMaterial.clone()

        let material2 = new Three.ShaderMaterial({
            uniforms: ToonShader1.uniforms,
            vertexShader: ToonShader1.vertexShader,
            fragmentShader: ToonShader1.fragmentShader,
            side: Three.DoubleSide,
            transparent: true,
            // blending: Three.AdditiveBlending,
        })
        const textureUrl = `/geojson/dahua/texture/${properties.name}.png`;
        // const texture = this.map.textureLoader.load(textureUrl)
        // texture.wrapS = Three.RepeatWrapping
        // texture.wrapT = Three.RepeatWrapping
        // material1.map = texture;
        // material1.transparent = true
        const mesh = new Three.Mesh(geometry, [material1, material2]); //网格模型对象
        const box3 = this.getBox3ByObject3D(mesh)
        const planeMesh = this.drawPlaneTextureByBox3(box3, textureUrl)
        // const planeMesh2 = this.drawPlaneTextureByBox3(box3, '/geojson/贴图.png', 0.02)
        const shareGroup = new Three.Group()

        shareGroup.add(mesh)
        shareGroup.add(planeMesh)
        // shareGroup.add(planeMesh2)
        this.extrudeShareGroup.add(shareGroup)
        // this.map.scene.add(shareGroup)
        // this.map.scene.add(planeMesh2)
    }

    getExtrudeGeometry(shapes: Three.Shape | Three.Shape[]) {
        return new Three.ExtrudeGeometry(shapes, {
            depth: 0.1, //拉伸高度 根据行政区尺寸范围设置，比如高度设置为尺寸范围的2%，过小感觉不到高度，过大太高了
            // bevelEnabled: false, //无倒角
            curveSegments: 128,
            bevelEnabled: true,
            bevelThickness: 0.001,
            bevelSize: 0.001,
            bevelOffset: 0.001,
            // bevelSegments: 0.001

        });
    }
}
