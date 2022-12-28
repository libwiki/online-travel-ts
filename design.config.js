const designConfig = require("./design.config.json")
const designWidth = designConfig.designWidth; // 设计稿的宽度 4K=3840*2160 2K= 2560*1440 4096
const designHeight = designConfig.designHeight; // 设计稿的高度 4K=3840*2160 2K= 2560*1440 4096
const vwUnitValue = designWidth / 100;  // 1vw = ?px
const vhUnitValue = designHeight / 100; // 1vh = ?px

module.exports = {
    designWidth, // 设计稿的宽度
    designHeight, // 设计稿的高度
    pxToVw,
    pxToVh,
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
