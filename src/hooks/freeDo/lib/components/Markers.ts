import Component from "/@/hooks/freeDo/lib/abstracts/Component";
import Configs from "/@/configs/Configs";
import {IMarkerOption} from "/@/hooks/freeDo/lib/types/Marker";
import {IFreeCameraFrame} from "/@/@types/markerOption";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";
import {isArray} from "lodash";

export default class Markers extends Component {
    protected _currentMarkers: IMarkerOption[] = []

    get currentMarkersMap() {
        const map = new Map<string, IMarkerOption>()
        this._currentMarkers.forEach(v => map.set(v.id, v))
        return map
    }


    async onReady() {
        super.onReady();
        const options = this.getMarkerOptions()
        this._currentMarkers = options;
        // 注：存在已经添加过的id都会导致返回的result=1,不影响插入
        await this.freeDo.g?.marker.add(options)
        // const enableCameraMovingEventRes = await this.freeDo.g?.settings.setEnableCameraMovingEvent(true)
        // console.log('enableCameraMovingEventRes', enableCameraMovingEventRes)

    }

    lockAtByMarkerId(id: string) {
        const o = this.currentMarkersMap.get(id)
        if (o && o.userDataObjects && isArray(o.userDataObjects)) {
            this.lockAt(o.userDataObjects as IFreeCameraFrame)
        }
    }

    lockAt(lookAtPoint?: IFreeCameraFrame) {
        if (!lookAtPoint) {
            return
        }
        this.freeDo.g?.camera.lookAt(lookAtPoint[0], lookAtPoint[1], lookAtPoint[2], lookAtPoint[3], lookAtPoint[4], lookAtPoint[5], lookAtPoint[6])
    }

    onEvent(event: IAirCityEvents) {
        super.onEvent(event);
        if (event.Type === 'marker') {  // 标记点点击事件
            this.lockAtByMarkerId(event.Id)
        }

    }


    protected getMarkerOptions() {
        return Configs.liangQingMarkers.map(item => {
            const o: IMarkerOption = {
                // tag唯一标识
                id: `marker_${+item.pid}`,
                // 坐标位置 这里要设置高度,转换为屏幕坐标时参与运算
                coordinate: item.point,
                // 可视范围
                range: [1, 8000000],
                // 锚点值设置 Y=原图底部原点的像素值 / 图片原高度
                anchors: [-23, item.iconSize[1]],
                // 显示图片路径 - 要使用绝对路径
                imagePath: `localhost:5173/markers/liangqing/sceinc/${item.name}.png`,
                // 鼠标悬停时显示的图片路径 - 要使用绝对路径
                hoverImagePath: `localhost:5173/markers/liangqing/sceinc/${item.name}.png`,
                // 图片的尺寸
                imageSize: item.iconSize,
                hoverImageSize: item.iconSize,
                // 图片固定尺寸，取值范围：false 自适应，近大远小，true 固定尺寸，默认值：false
                fixedSize: true,
                // 标签显示的文字
                // text: item.nameShort,
                // 是否开启文字动画
                useTextAnimation: false,
                // 文字大小w
                // fontSize: this.fontSize,
                // 文字的可见范围
                // textRange: [1, 8000000],
                // 文字颜色D
                // textColor: '#ffffff',
                // 文本背景颜色
                // textBackgroundColor: '#0085D0',
                // textOffset: [0, -5],
                // popupURL: this.api + "/api/gxota/v1/kanban/scenic?pid=" + sceinc.pid, //弹窗HTML链接
                // popupURL: `${this.server}marker.htm`, //弹窗HTML链接
                // 弹窗背景颜色
                popupBackgroundColor: [1.0, 1.0, 1.0, 1],
                // 弹窗大小
                popupSize: [400, 400],
                // 弹窗偏移
                popupOffset: [0, 153],
                // 标注点下方是否显示垂直牵引线
                showLine: false,
                // 失去焦点后是否自动关闭弹出窗口
                autoHidePopupWindow: true,
                // 自动判断下方是否有物体
                autoHeight: false,
                // 显示模式
                displayMode: 2,
                // 避让优先级
                priority: 0,
                // 是否参与遮挡剔除
                occlusionCull: true,
                // sort为自定义的值，用于标记标签的层级,值大的展示在前面
                sort: item.sort || 0,
                userDataObjects: item.lookAtPoint
            }
            return o
        })
    }
}
