<script lang="ts" setup>
import {computed} from "vue";
import {mergeG2plotsComponentProps, useG2plots} from "/@/hooks/charts/useG2plots";
import {Rose} from "@antv/g2plot";
import DefaultOptions from "/@/components/g2plots/DefaultOptions";


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
      series: 'label',
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
  hideYAxis: { // 是否隐藏y轴
    type: Boolean,
    default: true
  },
})

// 玫瑰图 默认配置属性(与传入的props合并后得到最终的配置效果)
// 教程：https://g2plot.antv.vision/zh/docs/manual/plots/rose
// API：https://g2plot.antv.vision/zh/docs/api/plots/rose
// styleAttrs: https://g2plot.antv.vision/zh/docs/api/graphic-style
const DefaultChartsOptions = {
  ...DefaultOptions,
  label: false,
  meta: {
    label: {
      formatter: (v: string | number) => {
        return `${v}`;
      },
    },
  },
  yAxis: {
    label: {
      style: {
        fill: 'white'
      }
    }
  },
  radius: .9,
  innerRadius: 0.2,
  startAngle: -90 * (Math.PI / 180), // (Math.PI / 180) =1°
  endAngle: 269 * (Math.PI / 180), // (Math.PI / 180) =1°
  sectorStyle: {
    lineWidth: 0, // 图形描边宽度
    cursor: 'pointer',
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    // fill: 'p(y)/red_bg_980.jpg',
    // fill:'l(0) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    // fill: 'r(0.5, 0.5, 0.5) 0:#ffffff 1:#1890ff',
  },

}

const chartOptions = computed(() => {
  // 合并图表配置
  return mergeG2plotsComponentProps(DefaultChartsOptions, props);
})

const g2plotHandle = useG2plots((el: HTMLElement, o: any) => {
  return new Rose(el, o)
}, chartOptions);


</script>

<template>
  <div class="tw-w-full tw-h-full" :ref="g2plotHandle.container"/>
</template>

<style lang="less" scoped>
.t {

}
</style>
