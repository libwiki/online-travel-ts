<script lang="ts" setup>
import _ from "lodash";
import {computed} from "vue";
import {mergeG2plotsComponentProps, useG2plots} from "/@/hooks/charts/useG2plots";
import {Bar} from "@antv/g2plot";
import DefaultOptions from "/@/components/g2plots/DefaultOptions";


const props = defineProps({
  data: {
    type: Array,
    default: () => [], //动态图数据参考 例：[{label:'nameA',value:1}, {label:'nameB',value:2}]
  },
  key: {
    type: Object,
    default: () => ({
      x: 'value',
      y: 'label',
      series: 'label',
    })
  },
  options: { // 所有的图表配置项，请参考个plot文档（最高优先级）
    type: Object,
    default: () => ({})
  },
  maxX: { // x轴最大刻度（保证图表不被遮挡）
    type: [Number, Function],
    default: () => {
      return (data: any[], key: string) => {
        const maxValue = _.maxBy(data, key)[key];
        // 最大数量 + 30%的最大数量 （这是最好看的）
        return maxValue + maxValue * 0.3;
      }
    }
  },
  maxLabelWords: { // 最大的标签的字数（仅当标签左对齐时有效，保证做堆积的标签不被遮挡）
    type: Number,
    default: 4
  },
  hideTooltip: { // 是否隐藏tooltip
    type: Boolean,
    default: false
  },
  hideXAxisLabel: { // 是否隐藏x轴的标签
    type: Boolean,
    default: true
  },
  xAxisLabelAlign: String, // x轴标签对齐方式（由于label标签的对齐方式 过深 仅作提取，会覆盖options）
})

// 条形图（横向） 默认配置属性(与传入的props合并后得到最终的配置效果)
// 教程：https://g2plot.antv.vision/zh/docs/manual/plots/bar
// API：https://g2plot.antv.vision/zh/docs/api/plots/bar
// styleAttrs: https://g2plot.antv.vision/zh/docs/api/graphic-style
const DefaultChartsOptions = {
  ...DefaultOptions,
  minBarWidth: 10,
  maxBarWidth: 15,
  barStyle: {
    radius: 5,
    cursor: "pointer",
  },
  label: {
    position: "right",
    style: {
      fill: 'white',
      textAlign: "left",
    }
  },
  xAxis: {
    line: false,
    tickLine: false,
    subTickLine: false,
    label: {
      style: {
        fill: 'white',
      }
    },
    grid: {
      line: false,
    }
  },
  yAxis: {
    line: false,
    tickLine: false,
    subTickLine: false,
    label: {
      offset: 10,
      style: {
        fill: 'white',
        textAlign: "left",
      }
    },
    grid: {
      line: false,
    }
  },
}

const chartOptions = computed(() => {
  // 合并图表配置
  return mergeG2plotsComponentProps(DefaultChartsOptions, props);
})

const g2plotHandle = useG2plots((el: string | HTMLElement, o: any) => {
  return new Bar(el, o)
}, chartOptions);


</script>

<template>
  <div class="tw-w-full tw-h-full" :ref="g2plotHandle.container"/>
</template>

<style lang="less" scoped>

</style>
