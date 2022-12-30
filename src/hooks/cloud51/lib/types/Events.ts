export interface I51CloudEventsOption {
    func_name: string // 例："APIAlready"
    args: Required<any>,
}


export enum E51CloudEvents {
    beginPlay = "beginPlay",
    APIAlready = "APIAlready", // 云渲染场景加载完成
    OnAddCustomPOISuccess = "OnAddCustomPOISuccess", // 添加标自定义标记点成功
    OnChangeViewSuccess = "OnChangeViewSuccess", // 切换地图视角 {args:{CurrentView:'GlobalView|ChinaView|MiniView|CityView'}}
    OnPOIClick = "OnPOIClick", // poi点击 {args:{id,...}}
    OnPOIUnHover = "OnPOIUnHover", // poi失去焦点 {args:{id,...}}
    OnPOILabelClick = "OnPOILabelClick", // poi标签点击 {args:{id,...}}
    OnCustomWebJsEvent = "OnCustomWebJsEvent", // h5自定义事件 args：{name,args}
    OnMapUp = "OnMapUp", // 地图区域升起来
    OnMapDown = "OnMapDown", // 地图区域降下去
}


export enum E51CloudCommands {
    StopRenderCloud = 'StopRenderCloud', // 停止
}
