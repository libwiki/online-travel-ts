export interface BaseObject {
    // 用于批量多次修改对象的属性
    // 在开始修改之前调用updateBegin，然后可以多次调用setXXX方法，最后调用updateEnd提交修改更新数据
    // 注意：updateBegin不是异步调用，不需要await，也没有回调函数参数
    updateBegin(): void


    // 用于批量多次修改对象的属性，与updateBegin配套使用
    // 注意： updateEnd是异步调用，可以用回调函数也可以await
    updateEnd(fn: Function): Promise<any>
}
