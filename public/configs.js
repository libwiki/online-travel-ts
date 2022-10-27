/**
 * window._configs
 * 0、该文件可以没有，但是不能改名、并且应该永远位于项目域名根目录下
 * 1、是为了方便外部注入到项目中的配置项目
 * 2、使用此种方式是为了在项目中可以方便的同步使用配置项
 * 3、index.html 中第一个引入的 js脚本 即是该文件（故此该文件不可改名、不可更远位置->应该永远位于项目域名根目录下）
 * 4、window._configs在源码中具体使用到的位置位于src/config/Config.js中
 * 5、window._configs中的配置会覆盖源码中的配置项
 * 6、需要定制化设置可去掉下列注释后填写新的数值即可（刷新页面会重新加载）
 */
const eChartsAnimationDurationUpdate = 3000;
window._configs = {
    // isDev: false, // 是否开发环境
    // debug: false, // 是否开启debug
    // baseUrl: "/", // 请求的服务器api接口基础url
    // jsonBaseUrl: '/', // 请求的服务器json文件的接口基础url （实现多接口）
    // version: '1.0.0', // 当前版本号（暂未有实际用处）
    // siteName: '集团大屏', // 当前网站名称
    // eChartsAnimationDurationUpdate, // eCharts数据更新频率
    // updateDataTimeWheelInterval: eChartsAnimationDurationUpdate * 3, // 时间轮间隔（数据更新的大定时器），应该是eCharts数据更新频率的整倍数，并且不能过小(>1000)（因为每一次时间轮都有可能请求后台数据）
}
