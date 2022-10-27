import designConfig from '../../design.config.json';
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

export function px2rem(variable?: number | string, unit = 'rem') {
    variable = Number(variable) || 0;
    if (variable === 0) {
        return String(variable);
    }
    const rootValue = designConfig.designWidth / 10;
    return `${variable / (rootValue)}${unit}`
}

// 将tailwind的rem转换为项目对应的设计稿的rem
// https://www.tailwindcss.cn/docs/customizing-spacing#-2
// 按照pxToRem的转换方式换算 tailwind （1 ： 0.25rem ： 4px）=>设计稿等于1600px => 则换算单位为16
export function twRem2Rem(remVariable: number, unit = 'rem') {
    return px2rem(remVariable * 16, unit)
}

export function canSetParams(method = 'get') {
    return ['get', 'delete', 'head'].includes(method.toLowerCase())
}
