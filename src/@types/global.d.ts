import {IAirCityAPI} from "/@/hooks/freeDo/lib/Interfaces";

export {}
declare global {
    declare module '*.js'

    interface Window {
        _configs: any;
        __g: IAirCityAPI; // 飞渡实例（只有new AirCityAPI以后，全局变量 __g 才是有效的。）
    }
}

