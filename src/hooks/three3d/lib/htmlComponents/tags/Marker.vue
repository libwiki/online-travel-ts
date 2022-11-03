<script lang="ts" setup>
import {computed, ref, toRaw} from "vue";
import {px2rem} from "/@/utils/helpers";
import _ from "lodash";
import {ITagCss} from "/@/hooks/three3d/lib/htmlComponents/tags/interfaces";

interface IProps {
  name?: string,
  text?: string | number,
  textAlign?: string
  flexRight?: boolean
  css?: ITagCss
}

// 各个参数默认值参考style中的变量，均是以设计图为准
const props = withDefaults(defineProps<IProps>(), {
  name: '',
  text: '',
  textAlign: 'center',
  flexRight: false,
  css(): ITagCss {
    return {
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
    }
  }
})
const fillOptions = ref<IProps>({}) // 在该处填充数据会覆盖props的内容
function setProps(data: IProps) {
  fillOptions.value = data
}


const options = computed(() => {
  return _.cloneDeep({...toRaw(props), ...toRaw(fillOptions.value)})
})
const cssOptions = computed(() => {
  return options.value.css || {}
})
// 默认样式是与style中的样式保持一致的（此处是为了方便外部更改标签组件的样式方便）
const styles = computed(() => {
  return {
    point: {
      width: px2rem(cssOptions.value.markerPoiWidth),
      height: px2rem(cssOptions.value.markerPoiHeight),
    },
    marker: {
      width: px2rem(cssOptions.value.markerWidth),
      height: px2rem(cssOptions.value.markerHeight),
      bottom: px2rem((cssOptions.value.markerPoiHeight || 0) / 2),
    },
    labelBox: {
      bottom: px2rem((cssOptions.value.markerPoiHeight || 0) / 2 + (cssOptions.value.markerHeight || 0) + (cssOptions.value.markerLabelMargin || 0)),
    },
    labelContent: {
      minWidth: px2rem((cssOptions.value.labelMarginLeft || 0) * 2 + (cssOptions.value.textXPadding || 0) * 2),
      height: cssOptions.value.labelHeight,
    },
    text: {
      height: px2rem((cssOptions.value.labelHeight || 0) - (cssOptions.value.arrowHeight || 0)),
      lineHeight: px2rem((cssOptions.value.labelHeight || 0) - (cssOptions.value.arrowHeight || 0)),
      padding: `0 ${px2rem(cssOptions.value.textXPadding || 0)}`,
      textAlign: `${options.value.textAlign}`,
    }
  }
})

function onContextmenu(e: MouseEvent) {
  e.preventDefault();
}

const emits = defineEmits<{
  (event: 'click', data: { e: MouseEvent, name: string }): void,
}>()

function onLabelClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  emits("click", {e, name: props.name})
}

defineExpose({setProps})
</script>

<template>
  <div class="marker-container " @contextmenu.stop="onContextmenu">
    <div :style="styles.point" class="point">
      <div :style="styles.marker" class="marker"></div>
      <div
          @click="onLabelClick"
          :style="styles.labelBox"
          :class="`label-box  ${options.flexRight?'right':''}`">
        <div :style="styles.labelContent" :class="`label-content  ${options.flexRight?'right':''}`">
          <div :style="styles.text" class="text">{{ options.text }}</div>
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
.marker-container {
  user-select: none;

  .point {
    position: relative;
    width: @markerPoiWidth;
    height: @markerPoiHeight;
    background: url("/geojson/dahua/texture/marker_poi.png") no-repeat;
    background-size: 100% auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .marker {
      width: @markerWidth;
      height: @markerHeight;
      bottom: (@markerPoiHeight/2);
      position: absolute;
      background: url("/geojson/dahua/texture/marker.png") no-repeat;
      background-size: 100% 100%;
    }

    .label-box {
      bottom: (@markerPoiHeight/2 + @markerHeight + @markerLabelMargin);
      left: 0;
      position: absolute;
      cursor: pointer;

      &.right {
        left: inherit;
        right: 0;
      }

      .label-content {
        min-width: (@labelMarginLeft*2 + @textXPadding*2);
        height: @labelHeight;
        position: relative;
        z-index: 0;

        &:before, &:after {
          position: absolute;
          content: "";
          height: 100%;
          top: 0;
          z-index: -1;
        }

        &:before {
          left: 0;
          width: 70%;
          background: transparent url("/geojson/dahua/texture/label_bg_left_26.png") no-repeat left;
          background-size: auto 100%;
        }

        &:after {
          right: 0;
          width: 35%;
          background: transparent url("/geojson/dahua/texture/label_bg_left_26.png") no-repeat right;
          background-size: auto 100%;
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

        }

        .text {
          height: @labelHeight - @arrowHeight;
          line-height: @labelHeight - @arrowHeight;
          padding: 0 @textXPadding;
          text-align: center;
          min-width: 100%;
          color: white;
          z-index: 10;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }
      }
    }
  }


}
</style>
