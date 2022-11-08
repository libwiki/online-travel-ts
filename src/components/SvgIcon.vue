<script lang="ts" setup>
import {computed} from 'vue'
import _ from "lodash";
import {px2vw} from "/@/utils/helpers";

const emits = defineEmits(['click'])
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
  size: [Number, String],
  height: [Number, String], // 默认高度为size 优先级高于size
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const styles = computed(() => {
  const styles: { width?: string, height?: string } = {}
  if (_.isUndefined(props.size)) {
    return styles
  }

  if (_.isString(props.size)) {
    styles.width = props.size;
    styles.height = props.size;
  } else if (_.isNumber(props.size)) {
    const size = px2vw(props.size)
    styles.width = size;
    styles.height = size;
  }
  if (_.isString(props.height)) {
    styles.height = props.height;
  } else if (_.isNumber(props.height)) {
    styles.height = px2vw(props.height);
  }

  return styles
})
</script>
<template>
  <svg class="svg-icon" :style="styles" @click="e=>$emit('click',e)" aria-hidden="true">
    <use :xlink:href="symbolId"/>
  </svg>

</template>


<style scoped>
.svg-icon {
  fill: currentColor;
  overflow: hidden;
  vertical-align: -0.15em;
}
</style>
