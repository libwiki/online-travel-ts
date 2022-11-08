<script lang="ts" setup>
import {ref} from "vue";
import Box from "/@/components/box/Box.vue";
import Table from "/@/components/g2plots/Table.vue";
import RankingColumn from "/@/components/g2plots/RankingColumn.vue";
import SvgIcon from "/@/components/SvgIcon.vue";
import _ from "lodash";


const data1 = ref([
  {label: "广东省", value: 1932, percent: 0.7478887},
  {label: "湖南省", value: 932, percent: 0.032530498},
  {label: "江苏省", value: 332, percent: 0.027838597},
  {label: "海南省", value: 232, percent: 0.027525805},
  {label: "福建省", value: 132, percent: 0.023146702},
])
const tableOptions = [
  {key: '', slot: "rank"},
  {key: 'label', title: "名称"},
  {key: 'value', className: 'skin-number-blue-color-color', title: "入园数量"},
]
</script>
<template>
  <div class="tw-h-full tw-w-full flex-col">
    <Box
        class="tw-flex-1"
        title="景区当日累计入园(人次)">
      <Table :options="tableOptions" :data="data1">
        <template #rank="{row}">
          <SvgIcon
              :size="20"
              :height="30"
              :name="`icon-rank-${row+1}`"/>
        </template>
      </Table>
    </Box>
    <Box
        class="tw-h-5/6 tw-flex-1"
        :height="400"
        content-class="tw-px-20 tw-pb-90"
        title="景区热度排行">
      <RankingColumn :data="_.sortBy(data1,'value')"/>
    </Box>
    <Box
        class="tw-flex-1"
        content-class="flex-col"
        title="运营数据">
      <div class="flex-col tw-w-full tw-flex-1 tw-justify-center">
        <div class="row-flex-center tw-h-1/3 tw-text-14 skin-number-light-blue-color">
          平台运营数据
        </div>
        <div class="tw-flex-1 flex-row tw-justify-around">
          <div class="tw-text-16 tw-h-full flex-col tw-items-center tw-space-y-10">
            <div class="tw-text-26">
              <span class="skin-number-pink-color">3,7123</span>
              <span class="tw-text-12 tw-px-5">次</span>
            </div>
            <div>打卡次数</div>
          </div>
          <div class="tw-h-full">
            <div class="tw-w-1 tw-h-60 skin-middle-divider-grey-blue-color"/>
          </div>
          <div class="tw-text-16  flex-col tw-items-center tw-space-y-10">
            <div class="tw-text-26">
              <span class="skin-number-light-green-color">3,7123</span>
              <span class="tw-text-12 tw-px-5">次</span>
            </div>
            <div>足迹数量</div>
          </div>
          <div class="tw-h-full">
            <div class="tw-w-1 tw-h-60 skin-middle-divider-grey-blue-color"/>
          </div>
          <div class="tw-text-16  flex-col tw-items-center tw-space-y-10">
            <div class="tw-text-26">
              <span class="skin-number-light-blue-color">3,7123</span>
              <span class="tw-text-12 tw-px-5">次</span>
            </div>
            <div>行程数量</div>
          </div>
          <div class="tw-h-full">
            <div class="tw-w-1 tw-h-60 skin-middle-divider-grey-blue-color"/>
          </div>
          <div class="tw-text-16  flex-col tw-items-center tw-space-y-10">
            <div class="tw-text-26">
              <span class="skin-number-orange-color">3,7123</span>
              <span class="tw-text-12 tw-px-5">次</span>
            </div>
            <div>识别花草次数</div>
          </div>
        </div>
      </div>
      <div class="flex-col tw-w-full tw-flex-1 tw-justify-center">
        <div class="row-flex-center tw-h-1/3 tw-text-14 skin-number-light-blue-color">
          微信公众号运营数据
        </div>
        <div class="tw-flex-1 flex-row tw-justify-around tw-leading-25">
          <div class="flex-row tw-flex-1 tw-justify-between tw-text-32">
            <div class="tw-text-18">
              <span>文章数</span>
            </div>
            <div class="tw-flex-1 flex-row tw-items-baseline">
              <span class="skin-number-light-green-color">2,7123</span>
              <span class="tw-text-12 tw-px-5">次</span>
            </div>
          </div>
          <div class="flex-row tw-flex-1 tw-justify-between tw-text-32">
            <div class="tw-flex-1 tw-text-18">
              <span>点击数</span>
            </div>
            <div class="tw-flex-1 flex-row tw-items-baseline">
              <span class="skin-number-orange-color ">2,7123</span>
              <span class="tw-text-12 tw-px-5">次</span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  </div>
</template>

<style lang="less" scoped>
.t {

}
</style>
