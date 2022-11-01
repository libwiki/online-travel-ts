export interface ITagCss {
    labelHeight?: number
    labelMarginLeft?: number
    textXPadding?: number
    arrowWidth?: number
    arrowHeight?: number
    markerWidth?: number
    markerHeight?: number
    markerPoiWidth?: number
    markerPoiHeight?: number
    markerLabelMargin?: number
}

export interface ITagProps {
    text?: string | number,
    textAlign?: string
    flexRight?: boolean
    css?: ITagCss
}
