import Component from "/@/hooks/freeDo/lib/abstracts/Component";
import Configs from "/@/configs/Configs";
import {IMarkerOption} from "/@/hooks/freeDo/lib/types/Marker";
import {IFreeCameraFrame} from "/@/@types/markerOption";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";
import {isArray} from "lodash";
import mitt from "mitt";
import {reactive} from "vue";

interface ICarouselOption {
    currentIndex: number,
    intervalTime: number,
    sleepTime: number,
    preDeltaTime: number,
    pauseFunc: ((e: Event) => void) | null,
}

interface ICarouselState {
    isRunning: boolean,
    isSleep: boolean,
}

// 标签组件的事件（轮播事件）
export enum MarkersEvents {
    onRunning = "onRunning",
    onSleep = "onSleep",
}

type MarkerEventType = {
    [k in MarkersEvents]: boolean
}

// 改组件不是纯粹的组件，因为他内部是依赖于外部数据的（httpApi、config等）
export class Markers extends Component {
    emitter = mitt<MarkerEventType>()
    protected _currentMarkers: IMarkerOption[] = [];
    protected _carouselOption: ICarouselOption = {
        currentIndex: 0,
        intervalTime: 10000,
        sleepTime: 60000,
        preDeltaTime: 0,
        pauseFunc: null
    }
    carouselState = reactive<ICarouselState>({
        isRunning: false,
        isSleep: false,
    })

    get carouselOption() {
        return this._carouselOption
    }

    get currentMarkersMap() {
        const map = new Map<string, IMarkerOption>()
        this._currentMarkers.forEach(v => map.set(v.id, v))
        return map
    }

    get nextIndex() {
        const nextIndex = this.carouselOption.currentIndex + 1;
        if (nextIndex >= this._currentMarkers.length) {
            return 0;
        }
        return nextIndex;
    }

    // 执行下一个轮播镜头
    runNextCameraFrame() {
        const nextIndex = this.nextIndex;
        if (nextIndex == this.carouselOption.currentIndex) {
            return
        }
        const option = this._currentMarkers[nextIndex];
        if (!option) {
            return;
        }
        this._carouselOption.currentIndex = nextIndex;
        this.lockAtByMarkerId(option.id)
    }

    toggleSleep(val: boolean, removeMarkerTransparentStatus = true) {
        const oldVal = this.carouselState.isSleep
        if (oldVal !== val) {
            this.carouselState.isSleep = val
            this.emitter.emit(MarkersEvents.onSleep, val)
        }
        if (val) { // 暂时休眠 设置开始休眠时间
            this._carouselOption.preDeltaTime = Date.now();
            if (removeMarkerTransparentStatus) { // 去除所有标签的透明度
                this.toggleMarkersImageTransparentStatus([], false)
            }

        }
    }

    toggleRunning(val: boolean, immediate = false) {
        const oldVal = this.carouselState.isRunning
        if (oldVal !== val) {
            this.carouselState.isRunning = val
            this.emitter.emit(MarkersEvents.onRunning, val)
        }
        if (val) { // 运行轮播
            if (immediate) { // 如果需要立即执行 则设置上次执行时间为0、并且清除休眠状态 即可
                this._carouselOption.preDeltaTime = 0;
                this.toggleSleep(false); // 并且清除休眠状态
            }
            this.addEventListeners(); // 监听用户操作事件（用户操作期间，轮播进入休眠状态）
        } else { // 停止运行轮播
            this.removeEventListeners(); // 轮播停止 用户操作监听可暂时停止（运行轮播后再启动）
            // 去除所有标签的透明度
            this.toggleMarkersImageTransparentStatus([], false)
        }
    }

    // 批量设置marker的透明状态，主要是更换图片
    toggleMarkersImageTransparentStatus(excludeIds: string[] = [], isTransparent = false) {
        const markers = this._currentMarkers.filter(v => !excludeIds.includes(v.id))
        if (markers.length > 0) {
            this.freeDo.g?.marker.updateBegin()
            for (let item of markers) {
                this.setMarkerImageTransparentStatus(item, isTransparent)
            }
            this.freeDo.g?.marker.updateEnd()
        }
    }

    setMarkerImageTransparentStatus(item: IMarkerOption, isTransparent = false) {
        const imagePath = isTransparent ? item.hoverImagePath.replace(/(\/.+)(\.png)/, '$1-vague$2') : item.imagePath;
        this.freeDo.g?.marker.setImagePath(item.id, imagePath)
    }


    onUpdate(deltaTime: number) {
        const o = this.carouselOption
        if (this.carouselState.isRunning) { // 轮播正在运行
            super.onUpdate(deltaTime);
            if (this.carouselState.isSleep) {
                if (deltaTime - o.preDeltaTime >= o.sleepTime) {
                    this._carouselOption.preDeltaTime = deltaTime;
                    this.runNextCameraFrame()
                    this.toggleSleep(false); // 解除休眠状态
                }
            } else if (deltaTime - o.preDeltaTime >= o.intervalTime) {
                this._carouselOption.preDeltaTime = deltaTime;
                this.runNextCameraFrame()
            }
        }
    }


    async onReady() {
        super.onReady();
        this._carouselOption.pauseFunc = (e) => {
            if (this.carouselOption.pauseFunc) {
                switch (e.type) {
                    case 'mousedown':
                        window.addEventListener('mousemove', this.carouselOption.pauseFunc)
                        break;
                    case 'mouseup':
                        window.removeEventListener('mousemove', this.carouselOption.pauseFunc)
                        break;
                }
            }
            this.toggleSleep(true, false)
        }
        const options = this.getMarkerOptions()
        this._currentMarkers = options;
        // 注：存在已经添加过的id都会导致返回的result=1,不影响插入
        await this.freeDo.g?.marker.add(options)
        // const enableCameraMovingEventRes = await this.freeDo.g?.settings.setEnableCameraMovingEvent(false)
        // console.log('enableCameraMovingEventRes', enableCameraMovingEventRes)
        this.toggleRunning(true); // 启动镜头轮播


    }

    addEventListeners() {
        if (this.carouselOption.pauseFunc) {
            window.addEventListener('mousedown', this.carouselOption.pauseFunc)
            window.addEventListener('mouseup', this.carouselOption.pauseFunc)
            window.addEventListener('mousewheel', this.carouselOption.pauseFunc)

        }
    }

    removeEventListeners() {
        if (this.carouselOption.pauseFunc) {
            window.removeEventListener('mousedown', this.carouselOption.pauseFunc)
            window.removeEventListener('mouseup', this.carouselOption.pauseFunc)
            window.removeEventListener('mousewheel', this.carouselOption.pauseFunc)
            window.removeEventListener('mousemove', this.carouselOption.pauseFunc)
        }
    }

    onDispose() {
        super.onDispose();
        this.removeEventListeners();
    }


    lockAtByMarkerId(id: string) {
        const o = this.currentMarkersMap.get(id)
        if (o && o.userDataObjects && isArray(o.userDataObjects)) {
            this.setMarkerImageTransparentStatus(o, false)
            this.toggleMarkersImageTransparentStatus([o.id], true)
            this.freeDo.lockAt(o.userDataObjects as IFreeCameraFrame)
        }
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
