<script lang="ts" setup>
import {px2rem} from "/@/utils/helpers";
import {computed} from "vue";

interface IProps {
  text: string | number,
  textAlign: string
  alignRight: boolean
  labelHeight: number
  labelMarginLeft: number
  textXPadding: number
  arrowWidth: number
  arrowHeight: number
  markerWidth: number
  markerHeight: number
  markerPoiWidth: number
  markerPoiHeight: number
  markerLabelMargin: number
}

// 各个参数默认值参考style中的变量，均是以设计图为准
const props = withDefaults(defineProps<IProps>(), {
  text: '',
  textAlign: 'center',
  alignRight: false,
  labelHeight: 48,
  labelMarginLeft: 25.5,
  textXPadding: 10,
  arrowWidth: 28,
  arrowHeight: 11,
  markerWidth: 34,
  markerHeight: 46,
  markerPoiWidth: 53,
  markerPoiHeight: 32,
  markerLabelMargin: 5,
})

// 默认样式是与style中的样式保持一致的（此处是为了方便外部更改标签组件的样式方便）
const styles = computed(() => {
  return {
    labelBox: {
      height: px2rem(props.labelHeight),
      lineHeight: px2rem(props.labelHeight),
      minWidth: px2rem(props.labelMarginLeft * 2 + props.textXPadding * 2 + 4),
    },
    textBox: {},
    text: {
      textAlign: props.textAlign,
      height: px2rem(props.labelHeight - props.arrowHeight),
      lineHeight: px2rem(props.labelHeight - props.arrowHeight),
    },
    markerBox: {
      top: px2rem(props.labelHeight + props.markerLabelMargin),
      left: px2rem(props.labelMarginLeft - (props.markerWidth / 2)),
      right: px2rem(props.labelMarginLeft - (props.markerWidth / 2)),
    },
    marker: {
      width: px2rem(props.markerWidth),
      height: px2rem(props.markerHeight),
    },
    point: {
      bottom: px2rem(0 - props.markerPoiHeight / 2),
      width: px2rem(props.markerPoiWidth),
      height: px2rem(props.markerPoiHeight),
    }
  }
})
</script>
<template>
  <div class="tag-container">
    <div :style="styles.labelBox" :class="`label-box ${alignRight?'right':''}`">
      <div :style="styles.textBox" class="text-box">
        <div :style="styles.text" class="text">
          文本
        </div>
      </div>
      <div :style="styles.markerBox" class="marker-box">
        <div :style="styles.marker" class="marker">
          <div :style="styles.point" class="point"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="less" scoped>
@labelHeight: 48px;
@labelMarginLeft: 25.5px;
@textXPadding: 10px;
@arrowWidth: 28px;
@arrowHeight: 11px;
@markerWidth: 34px;
@markerHeight: 46px;
@markerPoiWidth: 53px;
@markerPoiHeight: 32px;
@markerLabelMargin: 5px;
.tag-container {
  user-select: none;
  display: inline-flex;
  flex-direction: column;
  text-wrap: none;
  white-space: nowrap;


  .label-box {
    height: @labelHeight;
    line-height: @labelHeight;
    min-width: @labelMarginLeft*2 + @textXPadding*2 + 4;
    width: auto;
    position: relative;

    .text-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: white;
      font-size: 14px;
      z-index: 1;

      .text {
        height: @labelHeight - @arrowHeight;
        line-height: @labelHeight - @arrowHeight;
        padding: 0 @textXPadding;
        width: 100%;
      }
    }


    &:before, &:after {
      content: "";
      width: 50%;
      height: 100%;
      position: absolute;
      top: 0;
    }

    &:before {
      left: 0;
      background: transparent url("/geojson/dahua/texture/label_bg_left_26.png") no-repeat left;
      background-size: auto 100%;
    }

    &:after {
      right: 0;
      background: transparent url("/geojson/dahua/texture/label_bg_left_26.png") no-repeat right;
      background-size: auto 100%;
    }

    .marker-box {
      display: flex;
      flex-direction: row;

      top: @labelHeight + @markerLabelMargin;
      left: @labelMarginLeft - (@markerWidth/2);
      right: @labelMarginLeft - (@markerWidth/2);
      position: absolute;
      width: auto;
      height: auto;

      .marker {
        width: @markerWidth;
        height: @markerHeight;
        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background: url("/geojson/dahua/texture/marker.png") no-repeat;
        background-size: 100% 100%;

        .point {
          bottom: 0 - (@markerPoiHeight/2);
          width: @markerPoiWidth;
          height: @markerPoiHeight;
          position: absolute;
          background: url("/geojson/dahua/texture/marker_poi.png") no-repeat;
          background-size: 100% auto;
        }
      }
    }

    &.right {
      &:before {
        background: transparent url("/geojson/dahua/texture/label_bg_right_26.png") no-repeat left;
        background-size: auto 100%;
      }

      &:after {
        background: transparent url("/geojson/dahua/texture/label_bg_right_26.png") no-repeat right;
        background-size: auto 100%;
      }

      .marker-box {
        justify-content: flex-end;
      }
    }


  }


}
</style>
