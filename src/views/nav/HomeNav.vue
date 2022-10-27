<script lang="ts" setup>
import {onMounted, ref} from "vue";
import _ from "lodash";
import Area from "/@/components/g2plots/Area.vue";

const data = ref<any[]>([])
onMounted(() => {
  onInitData();
})


async function onInitData() {
  data.value = new Array(30).fill(0).map((v, i) => {
    const labelValue = i + 1;
    return {
      labelValue,
      label: String(labelValue),
      value: i * _.random(1000) * (i > 20 ? 0 : 1)
    }
  }).sort((a, b) => a.labelValue > b.labelValue ? -1 : 1)
  console.log(data.value)
}
</script>
<template>
  <Area :data="data"/>
</template>

<style lang="less" scoped>

</style>
