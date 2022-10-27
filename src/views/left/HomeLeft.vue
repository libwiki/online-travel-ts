<script lang="ts" setup>
import {reactive, ref, toRaw} from "vue";
import Gxota from "/@/api/modules/Gxota";
import _ from "lodash";
import Bar from "/@/components/g2plots/Bar.vue";
import Rose from "/@/components/g2plots/Rose.vue";
import RadialBar from "/@/components/g2plots/RadialBar.vue";
import Table from "/@/components/g2plots/Table.vue";
import Box from "/@/components/box/Box.vue";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

const data1 = ref([
  {label: "广东省", value: 1932, percent: 0.7478887},
  {label: "湖南省", value: 932, percent: 0.032530498},
  {label: "江苏省", value: 332, percent: 0.027838597},
  {label: "海南省", value: 232, percent: 0.027525805},
  {label: "福建省", value: 132, percent: 0.023146702},
])
const tableOptions = [
  {key: 'label'},
  {key: 'value', className: 'skin-number-blue-color-color'},
  {
    key: 'percent',
    className: 'skin-number-orange-color',
    format: (v: number) => `${BigNumber(v).times(100).toFixed(1)}%`
  },
]
const data2 = reactive({
  data: [
    {
      "percent": 0.7478887,
      "province": "广东省"
    },
    {
      "percent": 0.032530498,
      "province": "湖南省"
    },
    {
      "percent": 0.027838597,
      "province": "江苏省"
    },
    {
      "percent": 0.027525805,
      "province": "福建省"
    },
    {
      "percent": 0.023146702,
      "province": "海南省"
    },
  ],
  peopleOutTotal: "1634"
})

function initData() {
  initTouristFrom();
}

const touristData = ref({
  date: "",
  peopleCount: 0,
  peopleInPer: 0,
  peopleOutTotal: 0,
  provinceIns: [], // 省内市 city: "钦州市", percent: 0.18336329
  provinceOuts: [], // 省外市
  provinces: [], // 省份
})
const _touristData = toRaw(touristData.value);

// 获取客源地比例数据
async function initTouristFrom() {
  try {
    const results = await Gxota.tourist_from(dayjs().format("YYYY-MM-DD"))
    touristData.value = {
      ..._.cloneDeep(_touristData),
      ...results,

    }
    touristData.value.peopleOutTotal = Number((touristData.value.peopleCount * (1 - touristData.value.peopleInPer)).toFixed(0));
  } catch (e) {

  }
}


</script>
<template>
  <div class="tw-max-h-full tw-w-full flex-col">
    <div class="tw-w-full row-flex-center tw-leading-60">
      <div class="tw-text-16">
        区外游客总数：<span class="skin-number-orange-color tw-text-24">29,797</span><span
          class="tw-text-14 tw-pl-5">人次</span>
      </div>
    </div>
    <Box :height="300" title="外省客源地排行">
      <div class="tw-h-full tw-flex-1 row-flex-center">
        <Rose class="tw-h-5/6 tw-w-5/6" :data="data1"/>
      </div>
      <div class="tw-h-full tw-flex-1 row-flex-center">
        <Bar :data="data1"/>
      </div>
    </Box>

    <Box class="tw-flex-1" title="区外客源城市排行">
      <div class="tw-h-full tw-flex-1 row-flex-center">
        <RadialBar class="tw-h-5/6 tw-w-5/6" :data="data1"/>
      </div>
      <div class="tw-h-full tw-flex-1 row-flex-center">
        <Table stripe :data="data1" :options="tableOptions"/>
      </div>
    </Box>


    <Box class="tw-flex-1" title="外省客源城市排行">
      <div class="tw-h-full tw-flex-1 row-flex-center">
        <RadialBar class="tw-h-5/6 tw-w-5/6" :data="data1"/>
      </div>
      <div class="tw-h-full tw-flex-1 row-flex-center">
        <Table stripe :data="data1" :options="tableOptions"/>
      </div>
    </Box>

  </div>
</template>

<style lang="less" scoped>
.t {
}
</style>
