<script lang="ts" setup>
import {ref} from "vue";
import Marker from "/@/hooks/three3d/lib/htmlComponents/tags/Marker.vue";

const defaultStatus = false
const blockStatus = ref({
  title: defaultStatus,
  header: defaultStatus,
  left: defaultStatus,
  right: defaultStatus,
  nav: defaultStatus,
})
</script>

<template>
  <div class="main">
    <div class="header-box" v-if="blockStatus.header">
      <div class="bg-bak">
        <div class="tw-h-full tw-w-full col-flex-center">
          <router-view name="header">
            <img class="tw-h-2/5 tw-w-auto" alt="" src="../assets/images/bg-title.6aaa5fbf.png"/>
          </router-view>
        </div>
      </div>
    </div>
    <div class="render-box">
      <div class="render-relative-box">
        <div class="tw-rounded-full row-flex-center middle-label-box" v-if="blockStatus.title">
          <div class="tw-h-full tw-flex-1"></div>
          <div class="tw-h-2/3 tw-w-1 tw-rounded-full skin-middle-divider-grey-blue-color"></div>
          <div class="tw-h-full tw-flex-1"></div>
        </div>
        <div class="render-container">
          <router-view/>
        </div>
      </div>
    </div>
    <div class="row-flex-center nav-box" v-if="blockStatus.nav">
      <div class="nav">
        <router-view name="nav"/>
      </div>
    </div>
    <div class="left-box" v-if="blockStatus.left">
      <router-view name="left"/>
    </div>
    <div class="right-box" v-if="blockStatus.right">
      <router-view name="right"/>
    </div>
    <!--<Marker style="position: absolute;left: 50%;top: 50%" text="这是html的标签"/>-->
  </div>
</template>

<style lang="less" scoped>


.main {
  height: 100vh;
  overflow: hidden;
  position: relative;

  .header-box {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: @headerHeight;
    z-index: 1;

    .bg-bak {
      width: 100%;
      height: 100%;
      background: url("../assets/images/bg-header.a8f7dafe-bak.png") no-repeat;
      background-size: cover;
      background-position-x: center;
    }
  }

  .render-box, .left-box, .right-box, .nav-box {
    position: absolute;
    bottom: 0;

    &.render-box {
      top: 0;
      left: 0;
      right: 0;
      .skin-render-box-bg-color();
      background-size: cover;

      .render-relative-box {
        position: relative;
        width: 100%;
        height: 100%;

        .middle-label-box {
          z-index: 1;
          position: absolute;
          left: 50%;
          top: @headerHeight + 20px;
          transform: translate3d(-50%, 0, 0);
          border: solid 1px white;
          width: 300px;
          height: 70px;

        }

        .render-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    }

    &.left-box {
      padding-top: @headerHeight;
      top: 0;
      left: 0;
      width: @leftWidth;
      .skin-chart-block-left-bg-color()
    }

    &.right-box {
      padding-top: @headerHeight;
      top: 0;
      right: 0;
      width: @rightWidth;
      .skin-chart-block-right-bg-color()
    }

    &.nav-box {
      width: 100%;
      height: @navHeight;
      padding-left: @leftWidth;
      padding-right: @rightWidth;

      .nav {
        width: 100%;
        height: 100%;
      }
    }
  }

}


</style>
