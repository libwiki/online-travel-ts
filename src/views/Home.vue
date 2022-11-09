<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useThree3d} from "/@/hooks/three3d/useThree3d";
import {useFreeDo} from "/@/hooks/freeDo/useFreeDo";

const el = ref<HTMLElement>()
onMounted(() => {
  initThree3d()
})

function initThree3d() {
  if (el.value) {
    // const three3d = useThree3d(el.value)
    // three3d.onStart()
    const free = useFreeDo('playerController')
    free.onStart()
  }
}
</script>

<template>
  <div id="playerController" class="tw-w-full tw-h-full" ref="el">

  </div>
</template>

<style lang="less" scoped>

</style>
