<script lang="ts" setup>
import {computed} from "vue";
import _ from "lodash";
import {px2rem} from "/@/utils/helpers";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => [], // [{key:string,className:string,format:Function,slot:string,title,titleSlot,titleClassName}]
  },
  stripe: Boolean, // 是否带条纹的（斑马线）
  height: Number, // 设置高度后会存在滚动条
})

const tableData = computed(() => {
  const results: {
    headers: any[],
    data: any[],
  } = {
    headers: [],
    data: [],
  };
  const headers: any[] = [];
  props.data.forEach((datum: any, row) => {
    const rowDatum: any[] = [];
    props.options.forEach((option: any, col) => {
      const otherDatum = {datum, option, row, col}
      const value = _.isFunction(option.format) ? option.format(datum[option.key], otherDatum) : datum[option.key];
      rowDatum.push({value, ...otherDatum})
      if (row === 0) {
        headers.push({
          col,
          title: option.title,
          titleSlot: option.titleSlot,
          titleClassName: option.titleClassName,
        })
      }
    })
    if (headers.some(v => !_.isUndefined(v.title))) {
      results.headers = headers
    }
    results.data.push(rowDatum)
  })
  return results;
})
const bodyStyles = computed(() => {
  const styles: { height?: string } = {}
  if (_.isUndefined(props.height)) {
    return styles
  }
  // 50是头部的高度 结合css.header-row:height
  const headerHeight = tableData.value.headers.length > 0 ? 50 : 0
  styles.height = px2rem(props.height - headerHeight);
  return styles
})
</script>

<template>
  <div class="table-list">
    <div class="table-row header-row" v-if="tableData.headers.length>0">
      <div
          :class="`table-item ${item.titleClassName||''}`"
          v-for="(item,i) in tableData.headers"
          :key="`header-${i}`">
        <slot
            :col="item.col"
            :title="item.title"
            v-if="item.titleSlot&&item.titleSlot.length>0"
            :name="item.titleSlot">
          {{ item.title }}
        </slot>
        <template v-else>{{ item.title }}</template>
      </div>
    </div>
    <div :style="bodyStyles" class="body">
      <div
          :class="`table-row ${tableData.headers.length===0?'no-header':'has-header'} ${props.stripe?'stripe':''}`"
          v-for="(datum,row) in tableData.data" :key="row">
        <div
            :class="`table-item ${item.option.className||''}`"
            v-for="(item,col) in datum"
            :key="`${row}-${col}`">
          <slot
              :datum="item.datum"
              :option="item.option"
              :row="item.row"
              :col="item.col"
              v-if="item.option.slot&&item.option.slot.length>0"
              :name="item.option.slot">
            {{ item.value }}
          </slot>
          <template v-else>{{ item.value }}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.table-list {
  width: 100%;

  .body {
    flex: 1;
    overflow-y: auto;
  }

  .table-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 3px;

    &.header-row {
      background: rgba(0, 133, 208, .2);
      height: 50px;

      .table-item {
        font-size: 12px;
        color: #7bd7f8;
      }
    }

    &.stripe {
      &.no-header {
        &:nth-of-type(odd) {
          background-color: rgba(0, 133, 208, 0.2);
        }
      }

      &.has-header {
        &:nth-of-type(even) {
          background-color: rgba(0, 133, 208, 0.2);
        }
      }

    }

  }

  .table-item {
    padding: 10px 0;
    font-size: 14px;
    .row-flex-center();
    flex: 1;
  }
}
</style>
