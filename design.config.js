const designConfig = require("./design.config.json")
const designWidth = designConfig.designWidth; // 设计稿的宽度 4K=3840*2160 2K= 2560*1440 4096
const rootValue = designWidth / 10;
const vwUnitValue = designConfig.designWidth / 100;  // 1vw = ?px
const vhUnitValue = designConfig.designHeight / 100; // 1vh = ?px

module.exports = {
    designWidth, // 设计稿的宽度
    rootValue,
    pxToRem,
    twRemToRem,
    pxToVw,
    pxToVh,
}

function pxToRem(variable, unit = 'rem') {
    variable = Number(variable) || 0;
    if (variable === 0) {
        return variable;
    }
    return `${variable / (rootValue)}${unit}`
}

function pxToVw(variable, unit = 'vw') {
    variable = Number(variable) || 0;
    if (variable === 0) {
        return variable;
    }
    return `${variable / (vwUnitValue)}${unit}`
}

function pxToVh(variable, unit = 'vh') {
    variable = Number(variable) || 0;
    if (variable === 0) {
        return variable;
    }
    return `${variable / (vhUnitValue)}${unit}`
}

// 将tailwind的rem转换为项目对应的设计稿的rem
// https://www.tailwindcss.cn/docs/customizing-spacing#-2
// 按照pxToRem的转换方式换算 tailwind （1 ： 0.25rem ： 4px）=>设计稿等于1600px => 则换算单位为16
function twRemToRem(remVariable) {
    return pxToRem(remVariable * 16)
}
