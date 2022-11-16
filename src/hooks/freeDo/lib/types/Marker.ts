import {BaseObject, ICommandResult} from "/@/hooks/freeDo/lib/types/BaseObject";
import {CoordinateVector3s, Vector3, Vector2} from "/@/hooks/freeDo/lib/types/Vector";

// http://sdk.g-bim.cn/doc/api/Marker.html
export interface IMarker extends BaseObject {
    // 添加一个或多个标注点 调用时注意：单次创建的Marker对象数量不要超过5000个，在一个工程内创建的Marker对象总数量不要超过20万个。
    add(data: IMarkerOption | IMarkerOption[], fn?: Function): Promise<ICommandResult>

    // 修改一个或多个标注对象
    update(data: IMarkerOption | IMarkerOption[], fn?: Function): Promise<ICommandResult>

    // 根据ID获取标注的详细信息
    get(ids: string, fn?: Function): Promise<IMarkerOptionResult>

    get(ids: string[], fn?: Function): Promise<IMarkerOptionResult>

    // 设置标注的文本
    setText(id: string, newVal: string, fn?: Function): Promise<ICommandResult>

    // 设置避让优先级
    setPriority(id: string, newVal: string, fn?: Function): Promise<ICommandResult>

    // 设置标注的URL
    setURL(id: string, newVal: string, fn?: Function): Promise<ICommandResult>

    // 设置标注的位置
    setCoordinate(id: string, newVal: Vector3, fn?: Function): Promise<ICommandResult>

    // 设置是否参与遮挡剔除
    setOcclusionCull(id: string, newVal: boolean, fn?: Function): Promise<ICommandResult>


    // 设置标注的位置
    setFontColor(id: string, newVal: Colors, fn?: Function): Promise<ICommandResult>

    // 设置标注图片的大小
    setImageSize(id: string, newVal: Vector2, fn?: Function): Promise<ICommandResult>

    // setImageSize
    setImagePath(id: string, newVal: string, fn?: Function): Promise<ICommandResult>

    // 设置鼠标悬停时显示的图片路径
    setHoverImagePath(id: string, newVal: string, fn?: Function): Promise<ICommandResult>

    // 隐藏标注
    hide(ids: string | string[], fn?: Function): Promise<ICommandResult>

    // 隐藏所有标注
    hideAll(fn?: Function): Promise<any>

    // 显示标注
    show(ids: string | string[], fn?: Function): Promise<ICommandResult>

    // 显示所有标注
    showAll(fn?: Function): Promise<any>

    // 隐藏指定标注的弹出窗口
    hidePopupWindow(ids: string | string[], fn?: Function): Promise<ICommandResult>

    // 隐藏所有标注的弹出窗口
    hideAllPopupWindow(fn?: Function): Promise<any>

    // 显示指定标注的弹出窗口
    showPopupWindow(ids: string | string[], fn?: Function): Promise<ICommandResult>

    // 显示所有标注的弹出窗口
    showAllPopupWindow(fn?: Function): Promise<ICommandResult>

    // 设置弹窗HTML链接
    setPopupURL(id: string, newVal: string, fn?: Function): Promise<ICommandResult>

    // 设置弹窗大小: [width, height]
    setPopupSize(id: string, newVal: Vector2, fn?: Function): Promise<ICommandResult>

    // 设置弹窗偏移: [x, y]
    setPopupOffset(id: string, newVal: Vector2, fn?: Function): Promise<ICommandResult>

    // 删除场景中所有的标注
    clear(fn?: Function): Promise<ICommandResult>

    // 删除一个或多个标注对象
    delete(ids: string | string[], fn?: Function): Promise<ICommandResult>


    // 自动定位到合适的观察距离 rotation：[Pitch,Yaw,Roll]
    focus(ids: string | string[], distance?: number, flyTime?: number, rotation?: Vector3, fn?: Function): Promise<ICommandResult>

    // 自动定位到能观察所有标注对象的合适距离
    focusAll(distance?: number, flyTime?: number, rotation?: Vector3, fn?: Function): Promise<ICommandResult>
}

// 坐标系类型
export enum CoordinateTypeEnum {
    Projection, // Projection
    WGS84, // WGS84
}

export enum DisplayModeEnum {
    avoidance_move_show, // 0：相机移动不显示，参与避让聚合
    avoidance_move_hide, // 1：相机移动时显示，参与避让聚合
    no_avoidance_move_show, // 2：相机移动时显示，不参与避让聚合

}

export interface IMarkerOptionResult extends ICommandResult {
    data: IMarkerOption[]
}

// //常量颜色
// var constColor = Color.Red;
// //RGB颜色
// var rgbColor = 'RGB(255,255,255)';
// //16进制颜色
// var hexColor =  '#FFFEEE';
// //数组颜色 支持透明度设置
// var colorArr = [0.5,0.5,0.5,1];
export type RgbaColors = [number, number, number, number]
export type Colors = string | RgbaColors

export interface IMarkerOption {
    id: string // 标注点的唯一标识符
    coordinate: Vector3 | CoordinateVector3s // 标注点的位置坐标: [x, y, z]，取值示例
    imagePath: string // 图片路径，可以是本地路径，也支持网络路径，资源引入说明
    hoverImagePath: string // 鼠标悬停时显示的图片路径，资源引入说明
    text?: string // 显示的文字
    hoverImageSize?: Vector2 // 鼠标悬停时显示的图片尺寸: [width, height]， 默认值：[0,0] 使用图片自身的尺寸

    groupId?: string // 可选，Group分组
    userData?: string // 可选，用户自定义数据
    userDataObjects?: Partial<any> | any[]  // 可选，用户自定义数据
    coordinateType?: CoordinateTypeEnum // 坐标系类型，取值0(Projection), 1(WGS84)，如果不设置此参数，默认为0。
    anchors?: Vector2  // 锚点: [x, y]，默认值:[-16, 32]
    range?: Vector2 // 可视范围: [近裁距离, 远裁距离]，默认值: [10, 10000]
    textRange?: Vector2 // 文本可视范围: [近裁距离, 远裁距离]，默认值: [100, 6000]
    imageSize?: Vector2 // 图片的尺寸: [width, height]， 默认值[32,32]
    fixedSize?: boolean // 图片是否固定尺寸，取值范围：false 自适应，近大远小，true 固定尺寸，默认值：false
    useTextAnimation?: boolean // 是否打开文字展开动画效果，默认值：true
    textOffset?: Vector2 // 文本偏移: [x, y]，默认值：[0,0]
    fontSize?: number // 字体大小，默认值：12
    fontOutlineSize?: number // 字体轮廓线大小，默认值：1
    textBackgroundColor?: Colors // 文本背景颜色，默认值白色[1, 1, 1, 0.85]，支持四种格式，取值示例
    fontColor?: Colors // 字体颜色，默认值：黑色Color.Black，支持四种格式，取值示例
    fontOutlineColor?: Colors // 字体轮廓线颜色，默认值：黑色Color.Black，支持四种格式，取值示例
    popupBackgroundColor?: Colors // 弹窗背景颜色， [1.0,1.0,1.0,0.1] ，支持四种格式，取值示例
    popupURL?: string // 弹窗HTML链接或者视频文件路径，也支持rtsp协议实时视频流，资源引入说明，
    popupSize?: Vector2 // 弹窗大小: [width, height]，默认值：[600,400]
    popupOffset?: Vector2 // 弹窗偏移: [x, y]，默认值：[0,0]
    showLine?: boolean // 标注点下方是否显示垂直牵引线，默认不显示：false
    lineSize?: Vector2 // 牵引线粗细[width, height]，默认值：[0,0]，如果要显示牵引线，需要将该属性设置成非0值
    lineColor?: Colors // 牵引线颜色，默认值：白色，支持四种格式，取值示例
    lineOffset?: Vector2 // 牵引线偏移: [x, y]，默认值：[0,0]
    autoHidePopupWindow?: boolean // 是否自动关闭弹出窗口，默认值：true
    autoHeight?: boolean // 自动判断下方是否有物体，设置正确高度，默认值：false
    displayMode?: DisplayModeEnum // 显示模式
    priority?: number // 避让优先级，默认值：0
    occlusionCull?: boolean // 是否参与遮挡剔除
    sort?: number //sort为自定义的值，用于标记标签的层级,值大的展示在前面
}

