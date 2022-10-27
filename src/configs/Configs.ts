// 这里的env可以自动渠道.env.*文件的值
// 本地开发环境取 .env.development文件
// 正式打包环境取 .env.production文件
// 在生产环境中，这些环境变量会在构建时被静态替换。例：动态 key 取值 import.meta.env[key] 是无效的。
// https://cn.vitejs.dev/guide/env-and-mode.html#production-replacement
import _ from "lodash";
// @ts-ignore
import cssVars from "../styles/vars.less?export"
import {IConfigs} from "../@types/config";

const isDev = import.meta.env.DEV;

// eCharts数据更新频率
const eChartsAnimationDurationUpdate = 3000;
// 配置信息
const Configs: IConfigs = {
    isDev, // 是否开发环境
    cssVars,
    StorageKeyPrefix: "digit_", // 存贮key的前缀
    debug: import.meta.env.VITE_DEBUG || false, // 是否开启debug
    baseUrl: import.meta.env.VITE_API_HOST || '/', // 请求的服务器api接口基础url
    jsonBaseUrl: import.meta.env.VITE_API_JSON_HOST || '/', // 请求的服务器json文件的接口基础url （实现多接口）
    version: import.meta.env.VITE_VERSION || '1.0.0', // 当前版本号（暂未有实际用处）
    siteName: import.meta.env.VITE_SITE_NAME || '集团大屏', // 当前网站名称
    publicKey: import.meta.env.VITE_PUBLIC_KEY || '', // 加密公钥
    eChartsAnimationDurationUpdate, // eCharts数据更新频率
    updateDataTimeWheelInterval: eChartsAnimationDurationUpdate * 3, // 时间轮间隔（数据更新的大定时器），应该是eCharts数据更新频率的整倍数，并且不能过小（因为每一次时间轮都有可能请求后台数据）

    // 云渲染平台配置
    cloudRendering: {
        DTS_HOST: '192.168.0.105:8080', // 飞渡链连接地址
        options: {
            liangqing: {
                title: '南宁市良庆区',
                // 区域编码
                areaCode: 450108,
                // 飞渡看板id
                kanBanId: 21,
                // 飞渡工程实例id
                iid: '2482846585653',
                // 飞渡工程id
                dtsPid: 17,
                // 起始相机视角 地图起始坐标 x y z pitch yaw flyTime
                point: [541650.624375, 2523032.509219, 5803.175625, -24.152853, 114.310532, 1],
                // 标签聚焦时视角高度
                poiDistance: 1000
            },
            dahua: {
                title: '大化',
                areaCode: 451229,
                kanBanId: 19,
                iid: '2482846585653',
                dtsPid: 18,
                // 起始相机视角 地图起始坐标 x y z pitch yaw flyTime
                point: [-252406.46, 2470639.54, 212325.74, -45.0084, -64.101761, 1],
                // 标签聚焦时视角高度
                poiDistance: 70000
            }
        }
    }

};


/**
 * window._config
 * 1、是为了方便外部注入的配置项目
 * 2、使用此种方式是为了在项目中可以方便的同步使用配置项
 * 3、window._config具体注入的位置位于public/config.js
 * 4、index.html 中第一个引入的 js脚本 即是 public/config.js
 * 5、public/config.js中的配置会覆盖源码中的配置项
 */
export default _.merge<IConfigs, IConfigs>(Configs, _.cloneDeep(window._configs || {}))
