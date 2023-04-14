<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-13 11:06:38
 * @FilePath: \ace-firefly\src\views\HomeView.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by chongyanlin chongyanlin@aceimage.com, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue'

import HeaderView from '../components/HeaderView.vue'
import FooterView from '../components/FooterView.vue'
import MainMap from '../components/MainMap.vue'

export type stateTypes = 'live' | 'warn' | 'manage'
let curState = ref<stateTypes>('warn')
function liveStart() {
  curState.value = 'live'
}
</script>

<template>
  <div class="header-box">
    <HeaderView />
  </div>
  <main>
    <div class="map-box">
      <MainMap />
    </div>
    <div class="pannel left">
      <div class="content"></div>
      <div class="arc"></div>
    </div>
    <div class="pannel right">
      <div class="arc"></div>
      <div class="content"></div>
    </div>
  </main>
  <FooterView :state="curState" @live-start="liveStart" />
</template>
<style scoped lang="scss">
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
  width: calc(100% - 40px);
  left: 20px;
}
.pannel {
  position: absolute;
  height: calc(100% - var(--header-height));
  bottom: 0;
  z-index: 999;
  display: inline-flex;
  border: 1px solid rgb(54, 83, 87);
  &.left {
    background: linear-gradient(90deg, #043f5d, #08455e);
    left: 0;
    border-radius: 0px 80% 80% 0px;

    .arc {
      -moz-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      transform: scaleX(-1);
    }
  }
  &.right {
    right: 0;
    background: linear-gradient(-90deg, #043f5d, #08455e);
    border-radius: 80% 0px 0px 80%;
  }
  .content {
    height: 100%;
  }
  .arc {
    width: 7rem;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../assets/images/arc.png');
  }
}
</style>
