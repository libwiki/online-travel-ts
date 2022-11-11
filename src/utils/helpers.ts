import designConfig from '/@__dir/design.config.js';
import JSEncrypt from 'jsencrypt'
import Configs from "../configs/Configs";

export function getStorageKey(key: string) {
    return `${Configs.StorageKeyPrefix}${key}`
}
export function isInterface<T extends Object>(val:Object):val is T{
    return true
}
// rsa公钥加密
export function encrypt(txt: string) {
    const encryptor = new JSEncrypt()
    // 设置公钥
    encryptor.setPublicKey(Configs.publicKey)
    // 对需要加密的数据进行加密
    return encryptor.encrypt(txt)
}

export function px2vw(variable?: number | string, unit = 'vw') {
    return designConfig.pxToVw(variable, unit)
}

export function px2vh(variable?: number | string, unit = 'vh') {
    return designConfig.pxToVh(variable, unit)
}


export function canSetParams(method = 'get') {
    return ['get', 'delete', 'head'].includes(method.toLowerCase())
}
