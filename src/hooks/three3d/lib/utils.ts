import * as Three from "three";

export function getBox3ByObject3D(object3D: Three.Object3D) {
    const box3 = new Three.Box3();//创建一个包围盒
    box3.expandByObject(object3D);
    return box3;
}

export function getSizeByBox3(box3: Three.Box3) {
    //scaleV3表示包围盒长宽高尺寸
    const size = new Three.Vector3();
    box3.getSize(size)
    // 查看控制台包围盒大小，辅助设置相机参数
    return size
}

export function getCenterByBox3(box3: Three.Box3) {
    // 计算一个层级模型对应包围盒的几何体中心
    const center = new Three.Vector3();
    box3.getCenter(center);
    return center
}


/**
 * threeJs本身提供的mergeBufferGeometries方法有些小问题
 * 参考： https://blog.csdn.net/qq_37055675/article/details/120178475
 * @param objects
 */
export function mergeBufferGeometries(objects: Three.BufferGeometry[]) {
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
