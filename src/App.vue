<script lang="ts" setup>
import {computed} from "vue";
import Configs from "/@/configs/Configs";

const skinClass = computed(() => {
  return Configs.cssSkinName
})
</script>

<template>
  <div :class="skinClass">
    <router-view/>
  </div>
</template>

<style lang="less" scoped>
.t {

}

</style>
