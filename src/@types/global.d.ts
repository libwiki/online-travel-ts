import {IAirCityAPI} from "/@/hooks/freeDo/lib/Interfaces";
import {IAirCityPlayer, IAirCityPlayerOption} from "/@/hooks/freeDo/lib/types/AirCityPlayer";

export {}
declare global {
    declare module '*.js'

    interface Window {
        _configs: any;
        AirCityPlayer: { new(host: string, params: IAirCityPlayerOption): IAirCityPlayer };
        __g: IAirCityAPI; // 飞渡实例（只有new AirCityAPI以后，全局变量 __g 才是有效的。）
    }
}

