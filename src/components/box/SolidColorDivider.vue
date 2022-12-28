<script lang="ts" setup>
import {computed} from "vue";
import _ from "lodash";
import {px2vw} from "/@/utils/helpers";

const props = defineProps({
  height: Number,
  beforeWidth: [Number, String],
  beforeHeight: Number,
})

const dividerStyles = computed(() => {
  const styles: { height?: string } = {}
  if (_.isNumber(props.height)) {
    styles.height = px2vw(props.height)
  }
  return styles
})

const beforeStyles = computed(() => {
  const styles: { width?: string, height?: string } = {}
  if (_.isNumber(props.beforeHeight)) {
    styles.height = px2vw(props.beforeHeight)
  } else if (_.isNumber(props.height)) {
    styles.height = px2vw(props.height * 2)
  }
  if (_.isNumber(props.beforeWidth)) {
    styles.width = px2vw(props.beforeWidth)
  } else if (_.isString(props.beforeWidth) && !_.isEmpty(props.beforeWidth)) {
    styles.width = props.beforeWidth;
  }
  return styles
})
</script>

<template>
  <div class="divider-container tw-rounded-full" :style="dividerStyles">
    <div class="before" :style="beforeStyles"></div>
  </div>
</template>

<style lang="less" scoped>
@height: 1px;
@beforeWidth: 30%;
.divider-container {
  width: 95%;
  height: @height;
  position: relative;
  .skin-box-title-after-bg-color();

  .before {
  @apply tw-rounded-full;
    content: "";
    width: @beforeWidth;
    height: @height*2;
    position: absolute;
    left: 0;
    bottom: 0;
    .skin-box-title-before-bg-color();

  }
}
</style>
