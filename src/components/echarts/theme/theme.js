import _ from 'lodash'

export const DefaultChartsFillColor = '#ffffff'; // 默认字体色
export const DefaultChartsFontSize = 32; // window.innerWidth >= 3840 时默认标签字体大小
export const DefaultChartsAxisFontSize = 28; // window.innerWidth >= 3840 时默认的坐标轴的标签字体大小

// 根据屏幕大小获取对应的标签字体大小
export function getDefaultChartsFontSize() {

    const fontSizes = {
        960: 12,
        1440: 16,
        1600: 18,
        1920: 22,
        2560: 28,
        3840: DefaultChartsFontSize,
    }
    return fontSizes[getInnerWidthGrade()] || DefaultChartsFontSize
}
// 根据屏幕大小获取对应的坐标轴的标签字体大小
export function getDefaultChartsAxisFontSize() {
    const fontSizes = {
        960: 6,
        1440: 8,
        1600: 12,
        1920: 18,
        2560: 22,
        3840: DefaultChartsAxisFontSize,
    }
    return fontSizes[getInnerWidthGrade()] || DefaultChartsAxisFontSize
}
// 返回当前屏幕大小的档次
export function getInnerWidthGrade() {
    const w = window.innerWidth
    if (_.inRange(w, 0, 961)) {
        return 960
    } else if (_.inRange(w, 961, 1441)) {
        return 1440
    } else if (_.inRange(w, 1440, 1601)) {
        return 1600
    } else if (_.inRange(w, 1601, 1921)) {
        return 1920
    } else if (_.inRange(w, 1921, 2561)) {
        return 2560
    }
    return 3840
}



