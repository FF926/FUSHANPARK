<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-12 11:09:41
 * @FilePath: \ace-firefly\src\views\HomeView.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by chongyanlin chongyanlin@aceimage.com, All Rights Reserved. 
-->
<script setup lang="ts">
import HeaderView from '../components/HeaderView.vue'
import MainMap from '../components/MainMap.vue'
</script>

<template>
  <div class="header-box">
    <HeaderView />
  </div>
  <main>
    <div class="map-box">
      <MainMap />
    </div>
  </main>
</template>
<style scoped>
.header-box {
  height: var(--header-height);
  z-index: 999;
  position: relative;
}
main {
  height: calc(100% - var(--header-height));
}
.map-box {
  position: relative;
  padding: 10px;
  height: calc(100% - 20px);
  box-sizing: border-box;
}
</style>
