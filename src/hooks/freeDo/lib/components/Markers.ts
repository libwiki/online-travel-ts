import Component from "/@/hooks/freeDo/lib/abstracts/Component";
import {IMarkerOption} from "/@/hooks/freeDo/lib/types/Marker";
import {IFreeCameraFrame, IFreeMarkerOption, toIFreeCameraFrame} from "/@/@types/markerOption";
import {IAirCityEvents} from "/@/hooks/freeDo/lib/types/Events";
import {isArray, isNumber} from "lodash";
import mitt from "mitt";
import {reactive} from "vue";
import {Vector2, Vector3} from "/@/hooks/freeDo/lib/types/Vector";
import qs from "qs";
import {FreeDo} from "/@/hooks/freeDo/FreeDo";

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
    protected _autoRenderMarkers = false; // 是否自动渲染标记，自动启动轮播（false时仅生成标记数据，不添加到场景种，也不启动轮播功能）
    protected _currentMarkers: IMarkerOption[] = [];
    protected _showPopupWindowMarkers: IMarkerOption[] = [];
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

    protected _cameraChangedHandles: (() => void)[] = []; // 镜头调整完成后执行的函数

    constructor(freeDo: FreeDo, name?: string, autoRenderMarkers = false) {
        super(freeDo, name);
        this._autoRenderMarkers = autoRenderMarkers;
    }

    get autoRenderMarkers() {
        return this._autoRenderMarkers;
    }

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
            // this.toggleMarkersImageTransparentStatus([], false)
            // this.hidePopupWindow(); // 关闭弹框并且去除所有标签的透明度
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
        let imagePath = "";
        if (isTransparent) {
            imagePath = item.imagePath.replace(/(\/.+)(\.png)/, '$1-vague$2')
        } else {
            imagePath = item.imagePath.replace(/-vague\.png/, '.png')
        }
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
        const data = await this.getMarkerOptionData()
        const options = this.getMarkerOptions(data)
        this._currentMarkers = options;
        if (this.autoRenderMarkers) {
            // 注：存在已经添加过的id都会导致返回的result=1,不影响插入
            await this.freeDo.g?.marker.add(options)
            // 开启镜头监听
            this.freeDo.g?.settings.setEnableCameraMovingEvent(false)
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
            this.toggleRunning(true); // 启动镜头轮播
        }

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

    async onDispose() {
        await super.onDispose();
        await this.freeDo.g?.marker.clear()
        this.removeEventListeners();
    }

    async hideAllPopupWindow() {
        this._showPopupWindowMarkers = [];
        return this.freeDo.g?.marker.hideAllPopupWindow()
    }

    async lockAtByMarkerId(id: string, flyTime?: number) {
        await this.hideAllPopupWindow()
        const o = this.currentMarkersMap.get(id)
        if (o) {
            this.setMarkerImageTransparentStatus(o, false)
            this.toggleMarkersImageTransparentStatus([o.id], true)
            if (o.userDataObjects && isArray(o.userDataObjects)) {
                const frame = toIFreeCameraFrame(o.userDataObjects)
                if (isNumber(flyTime)) {
                    frame.flyTime = flyTime;
                }
                await this.freeDo.lookAt(frame)
            } else {
                this.freeDo.g?.marker.focus(o.id, this.freeDo.option.poiDistance, flyTime)
            }
            this._cameraChangedHandles = [];
            this._cameraChangedHandles.push(async () => { // 必须等待相机执行完成后才能设置（在onEvent生命周期中执行）
                await this.freeDo.g?.marker.showPopupWindow(o.id);
                this._showPopupWindowMarkers.push(o)
            })
            // setTimeout(async () => {
            //
            // }, flyTime * 1000 + 200)


        }
    }

    async hidePopupWindow() {
        this.toggleMarkersImageTransparentStatus([], false)
        return this.hideAllPopupWindow()
    }


    onEvent(event: IAirCityEvents) {
        super.onEvent(event);
        if (event.Type === 'marker') {  // 标记点点击事件
            if (this._showPopupWindowMarkers.find(v => v.id === event.Id)) {
                this.hidePopupWindow();
            } else {
                this.lockAtByMarkerId(event.Id, 0.8)
            }
        } else if (event.eventtype === 'CameraChanged') {
            if (this._cameraChangedHandles.length > 0) {
                this._cameraChangedHandles.forEach(func => func());
                this._cameraChangedHandles = [];
            }

        }
    }

    protected get host() {
        return window.location.host || ""
    }

    protected getPopupUrl(id: string) {
        const l = window.location;
        const options = {
            id,
            sceneName: this.freeDo.option.name,
        }
        return `${l.protocol}//${l.host}/popup/?${qs.stringify(options)}`
    }


    protected async getMarkerOptionData() {
        const markers = this.freeDo.option.markers || []
        const results: IFreeMarkerOption[] = []
        for (let item of markers) {
            if (item.point.length === 2) {
                const coordinate = await this.freeDo.g?.coord.gcs2pcs<Vector2>(item.point)
                if (!coordinate) {
                    continue;
                }
                const point = coordinate.coordinates[0]
                item.point = [...point, 1]

            }
            results.push(item)
        }
        return results
    }

    protected getMarkerOptions(markerOptions: IFreeMarkerOption[]) {
        const host = this.host; // host:port （没有协议前缀）
        const sceneName = this.freeDo.sceneName;
        const popupSize: Vector2 = ([480, 563]).map(v => v * 0.8) as Vector2;
        return markerOptions.map(item => {
            const iconSize = item.iconSize || [300, 150]
            const o: IMarkerOption = {
                // tag唯一标识
                id: `marker_${item.pid}`,
                // 坐标位置 这里要设置高度,转换为屏幕坐标时参与运算
                coordinate: (item.point as Vector3),
                // 可视范围
                range: [1, 8000000],
                // 锚点值设置 Y=原图底部原点的像素值 / 图片原高度
                // anchors: [-23, iconSize[1]],
                anchors: [-(iconSize[0] / 2), iconSize[1]],
                // anchors: [iconSize[0], iconSize[1]],
                // 显示图片路径 - 要使用绝对路径
                imagePath: `${host}/markers/freeDo/${sceneName}/${item.name}.png`,
                // 鼠标悬停时显示的图片路径 - 要使用绝对路径
                hoverImagePath: `${host}/markers/freeDo/${sceneName}/${item.name}.png`,
                // 图片的尺寸
                imageSize: item.iconSize,
                hoverImageSize: item.iconSize,
                // 图片固定尺寸，取值范围：false 自适应，近大远小，true 固定尺寸，默认值：false
                fixedSize: false,
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
                popupURL: `${this.getPopupUrl(item.pid)}`, //弹窗HTML链接
                // popupURL: `http://localhost:5173/popup`, //弹窗HTML链接
                // 弹窗背景颜色
                // popupBackgroundColor: [1.0, 1.0, 1.0, 0],
                // 弹窗大小
                popupSize,
                // 弹窗偏移
                popupOffset: [-iconSize[0], 0 - popupSize[1] / 2 - iconSize[1] / 2],
                // 标注点下方是否显示垂直牵引线
                showLine: false,
                // 失去焦点后是否自动关闭弹出窗口
                autoHidePopupWindow: false,
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
