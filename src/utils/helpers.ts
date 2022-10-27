import designConfig from '/@__dir/design.config.js';
import JSEncrypt from 'jsencrypt'
import Configs from "../configs/Configs";

export function getStorageKey(key: string) {
    return `${Configs.StorageKeyPrefix}${key}`
}

// rsa公钥加密
export function encrypt(txt: string) {
    const encryptor = new JSEncrypt()
    // 设置公钥
    encryptor.setPublicKey(Configs.publicKey)
    // 对需要加密的数据进行加密
    return encryptor.encrypt(txt)
}

/**
 *
 * @param variable
 * @param multiple
 * @returns {number|string|number} 4096 是因为fontSize来源于旧的一键游项目（4096是当时设计稿的宽度）
 */
export function fontSize(variable: number, multiple = 4096 / designConfig.designWidth) {
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (!clientWidth) return
    const fontSize = clientWidth / designConfig.designWidth;
    return variable * fontSize / multiple;
}

export function px2rem(variable: number, unit = 'rem') {
    return designConfig.pxToRem(variable, unit)
}

export function twRem2Rem(variable: number, unit = 'rem') {
    return designConfig.twRemToRem(variable, unit)
}

export function canSetParams(method = 'get') {
    return ['get', 'delete', 'head'].includes(method.toLowerCase())
}
