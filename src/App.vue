<script lang="ts" setup>
import {computed} from "vue";

const skinClass = computed(() => {
  return "skin-blue"
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
