<script lang="ts" setup>
import _ from "lodash";
import {computed} from "vue";
import {mergeG2plotsComponentProps, useG2plots} from "/@/hooks/charts/useG2plots";
import {Column} from "@antv/g2plot";
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
    default: true
  },
  maxY: { // y轴最大刻度（保证图表标签不被遮挡）
    type: [Number, Function],
    default: () => {
      return (data: any[], key: string) => {
        const maxValue = _.maxBy(data, key)[key];
        // 最大数量 + 10%的最大数量 （这是最好看的）
        return maxValue + maxValue * 0.1;
      }
    }
  },
})

// 条形图（横向） 默认配置属性(与传入的props合并后得到最终的配置效果)
// 教程：https://g2plot.antv.vision/zh/docs/manual/plots/bar
// API：https://g2plot.antv.vision/zh/docs/api/plots/bar
// styleAttrs: https://g2plot.antv.vision/zh/docs/api/graphic-style
const DefaultChartsOptions = {
  ...DefaultOptions,
  minColumnWidth: 10,
  maxColumnWidth: 15,
  columnStyle: {
    radius: 5,
    cursor: "pointer",
    shadowColor: 'black',
  },
  label: {
    position: "center",
    style: {
      fill: 'white',
      textAlign: "center",
    }
  },
  xAxis: {
    line: false,
    tickLine: false,
    subTickLine: false,
    label: {
      // rotate: Math.PI / -2,
      style: {
        fill: 'white',
        textAlign: "center",
      },
      formatter(text: string) {
        return text.split('').join('\n')
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
    label: false,
    grid: {
      line: false,
    }
  },
}

const chartOptions = computed(() => {
  // 合并图表配置
  return mergeG2plotsComponentProps(DefaultChartsOptions, props);
})

const g2plotHandle = useG2plots((el: HTMLElement, o: any) => {
  return new Column(el, o)
}, chartOptions);


</script>

<template>
  <div class="tw-w-full tw-h-full" :ref="g2plotHandle.container"/>
</template>

<style lang="less" scoped>

</style>
