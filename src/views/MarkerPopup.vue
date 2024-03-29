<script lang="ts" setup>
import {computed, onMounted, onUnmounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import Configs from "/@/configs/Configs";
import {FreeDo, FreeDoEvents} from "/@/hooks/freeDo/FreeDo";
import {isFunction} from "lodash";
import {IFreeMarkerOption} from "/@/@types/markerOption";
import {Markers} from "/@/hooks/freeDo/lib/components/Markers";
import {ICloudOption} from "/@/@types/config";
import {IMarkerOption} from "/@/hooks/freeDo/lib/types/Marker";

const route = useRoute()
const router = useRouter()
const data = reactive<any>({
  id: '',
  sceneName: 'liangqing',
  coverFloat: 'none', // none|left|right 封面图布局方式
  coverFit: 'fill', // fill none
  nameFontSize: 48, // 标题字号
  readying: false,
  delayCloseFunc: null,
})
const freeDo = ref<FreeDo>()
const markersComponent = ref<Markers>()
const sceneOption = ref<ICloudOption>()

onMounted(() => {
  parseQuery();
  initFreeDoApi();
})
onUnmounted(() => {
  data.readying = false;
  if (data.delayCloseFunc) {
    data.delayCloseFunc = null;
  }
})

function initFreeDoApi() {
  try {
    const cloudRenderingOption = Configs.freeDoCloudRendering
    sceneOption.value = cloudRenderingOption.options.find(v => v.name === data.sceneName)
    if (!sceneOption.value) {
      throw new Error('场景配置不存在')
    }
    freeDo.value = new FreeDo(cloudRenderingOption.host, sceneOption.value)
    markersComponent.value = new Markers(freeDo.value)
    freeDo.value.emitter.on(FreeDoEvents.onReady, _ => {
      data.readying = true
      if (isFunction(data.delayCloseFunc)) {
        data.delayCloseFunc()
      }
    })
    freeDo.value.emitter.on(FreeDoEvents.onDispose, _ => data.readying = false)
    freeDo.value.onStart()
  } catch (e) {
    console.log(e)
  }
}

function onClosePopup() {
  function delayCloseFunc() {
    // markersComponent.value?.hidePopupWindow();
    freeDo.value?.g?.marker.hideAllPopupWindow()
    const ids = sceneOption.value?.markers?.map(v => `marker_${v.pid}`) || [];
    freeDo.value?.g?.marker.get(ids).then(res => {
      const markers: IMarkerOption[] = res.data
      if (markers.length > 0) {
        freeDo.value?.g?.marker.updateBegin()
        for (let item of markers) {
          const imagePath = item.imagePath.replace(/-vague\.png/, '.png')
          console.log(imagePath)
          freeDo.value?.g?.marker.setImagePath(item.id, imagePath)
        }
        console.log(markers)
        freeDo.value?.g?.marker.updateEnd()
      }
    })
    data.delayCloseFunc = null;
  }

  if (data.readying) {
    delayCloseFunc()
  } else {
    data.delayCloseFunc = delayCloseFunc
  }
}


// 解析参数
async function parseQuery() {
  await router.isReady();
  const {id, sceneName, coverFloat, coverFit, nameFontSize}: any = route.query
  data.id = id || ''
  data.sceneName = sceneName || ''
  data.coverFloat = coverFloat || 'none'
  data.coverFit = coverFit || 'fill'
  data.nameFontSize = nameFontSize || 46
}

const markerOption = computed<IFreeMarkerOption>(() => {
  const name = data.sceneName || Configs.freeDoCloudRendering.defaultScene;
  const scene = Configs.freeDoCloudRendering.options.find(v => v.name === name)
  if (!scene) {
    return {} as IFreeMarkerOption
  }
  return scene.markers?.find(v => v.pid === data.id) || {} as IFreeMarkerOption;
})

const coverStyles = computed(() => {
  return {
    float: data.coverFloat,
    width: data.coverFit === 'fill' ? '100%' : 'auto',
    height: 'auto',
    marginBottom: '10px',
  }
})
const contentStyles = computed(() => {
  return {
    float: data.coverFloat,
    width: data.coverFit === 'fill' ? '100%' : 'auto',
    height: 'auto',
    marginBottom: '10px',
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <div class="title">
        <div :class="`text-box font-size-${data.nameFontSize}`">{{ markerOption.name }}</div>
      </div>
      <div class="close" @click.stop="onClosePopup()"></div>
    </div>
    <div class="body">
      <div :style="contentStyles" class="content-box">
        <img alt=""
             v-for="(item,i) in []"
             :key="i"
             :style="coverStyles"
             :src="`/static/markers/cover/${item}`"/>
        {{ markerOption.name }}
      </div>
    </div>
  </div>
</template>


<style lang="less" scoped>
@designWidth: 960; // 弹框的设计稿宽度
@designHeight: 1126; // 弹框的设计稿宽度
@headerHeight: 159;
.pxToVw (@px, @attr: width) {
  @vw: max(0, min(100, (@px / @designWidth) * 100));
    @{attr}: ~"@{vw}vw";
}

.pxToVh (@px, @attr: height) {
  @vh: max(0, min(100, (@px / @designHeight) * 100));
    @{attr}: ~"@{vh}vh";
}

html, body {
  padding: 0;
  margin: 0;
}

.container {
  color: white;
  .pxToVw(36, font-size);
  .pxToVw(960);
  .pxToVh(1126);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: transparent url("/markers/popup/popup_bg.png") no-repeat;
  background-size: 100% 100%;

  .header {
    box-sizing: border-box;
    .pxToVh(@headerHeight);
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    .pxToVw(44, padding-left);

    .title {
      box-sizing: border-box;
      .pxToVw(548);
      .pxToVh(99);
      background: transparent url("/markers/popup/popup_title_bg.png") no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      .pxToVw(52, padding-left);
      .pxToVw(20, padding-right);

      .text-box {
        .pxToVw(48, font-size);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.font-size-46 {
          .pxToVw(46, font-size);
        }

        &.font-size-32 {
          .pxToVw(32, font-size);
        }

        &.font-size-30 {
          .pxToVw(30, font-size);
        }
      }
    }

    .close {
      box-sizing: border-box;
      cursor: pointer;
      position: absolute;
      right: 0;
      bottom: 0;
      .pxToVw(90);
      .pxToVh(101);
      background: transparent url("/markers/popup/close.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .body {
    flex: 1;
    .pxToVw(50, padding-left);
    .pxToVw(25, padding-right);
    .pxToVh(56, padding-bottom);
    .pxToVh(@designHeight - @headerHeight);
    box-sizing: border-box;
    overflow-y: hidden;

    .content-box {
      box-sizing: border-box;
      width: 100%;
      height: auto;
      .pxToVh(@designHeight - @headerHeight - 80);
      overflow-y: scroll;
      .pxToVw(19, padding-right);
      .pxToVh(50, line-height);
      // 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸
      &::-webkit-scrollbar {
        .pxToVw(28);
      }

      // 定义滚动条轨道 内阴影+圆角
      &::-webkit-scrollbar-track {
        background-color: #01181D;

      }

      // 定义滑块 内阴影+圆角
      &::-webkit-scrollbar-thumb {
        .pxToVw(32);
        .pxToVh(70);
        background: url("/markers/popup/slider.png") no-repeat center center;
        background-size: 120% 100%;
      }

      // 这是总的上下左右四个箭头，需要宽度设置0，高度设置0，不然有默认按钮高度
      &::-webkit-scrollbar-button {
        width: 0;
        height: 0;
      }

      // 上面箭头
      &::-webkit-scrollbar-button:vertical:single-button:start {
        .pxToVw(28);
        .pxToVh(30);
        background: transparent url("/markers/popup/arrow_up.png") no-repeat center bottom;
        background-size: 100% 100%;
        cursor: pointer;
      }

      // 下面箭头
      &::-webkit-scrollbar-button:vertical:single-button:end {
        .pxToVw(28);
        .pxToVh(30);
        background: transparent url("/markers/popup/arrow_down.png") no-repeat center center;
        background-size: 100% 100%;
        cursor: pointer;
      }

    }
  }
}

</style>
