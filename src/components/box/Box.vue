<script lang="ts" setup>
import SolidColorDivider from "/@/components/box/SolidColorDivider.vue";
import {computed} from "vue";
import _ from "lodash";
import {px2vh, px2vw} from "/@/utils/helpers";

const props = defineProps({
  title: String,
  titleClass: String,
  contentClass: String,
  width: Number,
  maxWidth: Number,
  height: Number,
  maxHeight: Number,
})
const styles = computed(() => {
  const styles: {
    width?: string,
    height?: string,
    maxWidth?: string,
    maxHeight?: string,
  } = {}
  if (_.isNumber(props.width)) {
    styles.width = px2vw(props.width)
  }
  if (_.isNumber(props.maxHeight)) {
    styles.maxHeight = px2vh(props.maxHeight)
  }
  if (_.isNumber(props.height)) {
    styles.height = px2vh(props.height)
  }
  if (_.isNumber(props.maxWidth)) {
    styles.maxWidth = px2vw(props.maxWidth)
  }
  return styles
})
</script>

<template>
  <div :style="styles" class="tw-px-10 tw-w-full tw-h-full box-container">
    <div :class="`tw-leading-40 tw-text-24 ${props.titleClass||''}`">
      <slot name="title">{{ props.title || '' }}</slot>
    </div>
    <SolidColorDivider/>
    <div :class="`row-flex-center tw-h-full content-box ${props.contentClass||''}`">
      <slot/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.box-container {
  //flex-grow: 1;
  //flex-shrink: 1;
  //flex-basis: 0;

  .content-box {
    padding-right: 5%;
  }
}

</style>
