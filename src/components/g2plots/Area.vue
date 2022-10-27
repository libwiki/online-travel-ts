<script lang="ts" setup>
import {computed} from "vue";
import {Area} from "@antv/g2plot";
import DefaultOptions from "/@/components/g2plots/DefaultOptions";
import {mergeG2plotsComponentProps, useG2plots} from "/@/hooks/charts/useG2plots";


const props = defineProps({
  data: {
    type: Array,
    default: () => [], //动态图数据参考 例：[{label:'nameA',value:1}, {label:'nameB',value:2}]
  },
  key: {
    type: Object,
    default: () => ({
      x: 'label',
      y: 'value',
      serial: "label",
    })
  },
  options: { // 所有的图表配置项，请参考个plot文档（最高优先级）
    type: Object,
    default: () => ({})
  },
  hideTooltip: { // 是否隐藏tooltip
    type: Boolean,
    default: false
  },
  hideLabel: { // 是否隐藏label
    type: Boolean,
    default: true
  },
})

// 条形图（横向） 默认配置属性(与传入的props合并后得到最终的配置效果)
// 教程：https://g2plot.antv.vision/zh/docs/manual/plots/bar
// API：https://g2plot.antv.vision/zh/docs/api/plots/bar
// styleAttrs: https://g2plot.antv.vision/zh/docs/api/graphic-style
const DefaultChartsOptions = {
  ...DefaultOptions,
  label: {
    style: {
      fill: 'white',
      textAlign: "center",
    }
  },
  smooth: true,
  startOnZero: true,
  xAxis: {
    range: [0, 1],
    label: {
      style: {
        fill: 'white',
      }
    }
  },
  yAxis: {
    label: {
      style: {
        fill: 'white',
      }
    }
  },

}
const chartOptions = computed(() => {
  // 合并图表配置
  return mergeG2plotsComponentProps(DefaultChartsOptions, props);
})


const g2plotHandle = useG2plots((el: string | HTMLElement, o: any) => {
  return new Area(el, o.value || o)
}, chartOptions);

</script>

<template>
  <div class="tw-w-full tw-h-full" :ref="g2plotHandle.container"/>
</template>

<style lang="less" scoped>

</style>
