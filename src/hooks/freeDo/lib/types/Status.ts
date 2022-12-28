export enum CloudStatusEnum {
    WS_Disconnected, // WebSocket连接断开（ 颜色：红 ）
    WS_Connecting, // WebSocket正在尝试连接（颜色：灰 ）
    WS_Connected, // WebSocket已连接，正在建立WebRTC连接（颜色：黄 ）
    RTC_Opened, // WebRTC通道已打开（颜色：蓝 ）
    Video_LoadedMetaData, // 视频流元数据已加载（内部使用）
    OnReady, // Acp工程已打开（颜色：绿 ）
}

export enum APIErrorCodeEnum {
    OK, // 正常
    InvalidParameters,// 参数错误
    InternalError, // 内部错误（环境尚未准备好、空指针等）
    ResourceNotFound, // 数据不存在
    AcpProjWKTNotSet,// 工程未设置坐标系
    CoordinateConversionFailed, // 坐标转换失败
    IDExists, // 指定ID的对象已经存在了
    InvalidRequestType, // 无效的请求类型
    InvalidRequestString,// 无效的请求（包含了InvalidRequestType）
    NoCommand, // CommandFactory没有创建对应的Command
    DataTypeNotSupport, // 不支持这种类型的数据（比如压平操作只能是OSGB和Terrain）
    InvalidOperation, // 无效的操作
    ProjectNotOpened, // 工程尚未打开，此时不能进行API调用！
    CodeMax = 65535,		 // 65535
}
