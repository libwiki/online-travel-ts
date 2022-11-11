<script lang="ts" setup>
import {computed, onMounted, reactive} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()
const data = reactive({
  id: '',
  menu: '',
  coverFloat: 'none', // none|left|right 封面图布局方式
  coverFit: 'fill', // fill none
  bodyBox: {
    width: 885,
    height: 967,
  },
  nameFontSize: 48, // 标题字号
})

onMounted(() => {
  parseQuery();
})


// 解析参数
async function parseQuery() {
  await router.isReady();
  const {id, menu, coverFloat, coverFit, nameFontSize}: any = route.query
  data.id = id || ''
  data.menu = menu || ''
  data.coverFloat = coverFloat || 'none'
  data.coverFit = coverFit || 'fill'
  data.nameFontSize = nameFontSize || 48
}

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
        <div :class="`text-box font-size-${data.nameFontSize}`">这是标题呀</div>
      </div>
      <div class="close" @click=""></div>
    </div>
    <div ref="bodyRef" class="body">
      <div :style="contentStyles" class="content-box">
        <van-image
            v-for="(item,i) in []"
            :key="i"
            :style="coverStyles"
            :src="`/static/markers/cover/${item}`"/>
        这是内容呀
      </div>
    </div>
  </div>
</template>


<style lang="less" scoped>
@designWidth: 960; // 弹框的设计稿宽度
.pxToVw (@px, @attr: width) {
  @vw: (@px / @designWidth) * 100;
    @{attr}: ~"@{vw}vw";
}

.container {
  color: white;
  .pxToVw(36, font-size);
  .pxToVw(960);
  .pxToVw(1126, height);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: transparent url("/markers/popup/popup_bg.png") no-repeat;
  background-size: 100% 100%;

  .header {
    box-sizing: border-box;
    .pxToVw(159, height);
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    .pxToVw(44, padding-left);

    .title {
      box-sizing: border-box;
      .pxToVw(548);
      .pxToVw(99, height);
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
      .pxToVw(101, height);
      background: transparent url("/markers/popup/close.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .body {
    flex: 1;
    .pxToVw(50, padding-left);
    .pxToVw(25, padding-right);
    .pxToVw(56, padding-bottom);
    box-sizing: border-box;
    overflow-y: hidden;

    .content-box {
      box-sizing: border-box;
      width: 100%;
      height: auto;
      overflow-y: scroll;
      .pxToVw(19, padding-right);
      .pxToVw(50, line-height);
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
        .pxToVw(70, height);
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
        .pxToVw(30, height);
        background: transparent url("/markers/popup/arrow_up.png") no-repeat center bottom;
        background-size: 100% 100%;
        cursor: pointer;
      }

      // 下面箭头
      &::-webkit-scrollbar-button:vertical:single-button:end {
        .pxToVw(28);
        .pxToVw(30, height);
        background: transparent url("/markers/popup/arrow_down.png") no-repeat center center;
        background-size: 100% 100%;
        cursor: pointer;
      }

    }
  }
}
</style>
