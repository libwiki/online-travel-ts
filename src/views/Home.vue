<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {useThree3d} from "/@/hooks/three3d/useThree3d";
import {useFreeDo} from "/@/hooks/freeDo/useFreeDo";
import SvgIcon from "/@/components/SvgIcon.vue";

const el = ref<HTMLElement>()
const free = useFreeDo('playerController')
onMounted(() => {
  initThree3d()
})

function initThree3d() {
  if (el.value) {
    // const three3d = useThree3d(el.value)
    // three3d.onStart()

    free.onStart()
  }
}

const isRunning = computed(() => {
  const state = free.markerComponent.carouselState
  return state.isRunning && !state.isSleep
})

function onRunning() {
  free.markerComponent.toggleSleep(false)
  free.markerComponent.toggleRunning(true)
}


</script>

<template>
  <div id="playerController" class="tw-w-full tw-h-full" ref="el">

  </div>
  <div
      @mousedown.stop @mouseup.stop @mousemove.stop
      class="play-controller col-flex-center tw-space-y-10">
    <SvgIcon
        size="25" name="icon-pause-active"
        class="tw-cursor-pointer"
        @click="free.markerComponent.toggleSleep(true)"
        v-if="isRunning"/>
    <SvgIcon
        size="25" name="icon-play-active"
        class="tw-cursor-pointer"
        @click="onRunning"
        v-else/>
    <SvgIcon
        size="25" name="icon-close-loop"
        @click="free.markerComponent.toggleRunning(false)"
        class="tw-cursor-pointer"/>
    <SvgIcon
        size="25" name="icon-location"
        @click="free.freeDo.onResetCameraFrame()"
        class="tw-cursor-pointer"/>
  </div>
</template>

<style lang="less" scoped>
.play-controller {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  position: absolute;
  right: @rightWidth + 20px;
  bottom: @navHeight + 20px;
  width: 55px;
  height: auto;
  padding: 15px 0;
}
</style>
