<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-12 09:20:07
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-05-12 10:03:36
 * @FilePath: \ace-firefly\src\views\HomeView.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-14 08:49:05
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
import PanelView from './PanelView.vue'
import emitter from '@/event-bus'
export type stateTypes = 'live' | 'warn' | 'manage'
let curState = ref<stateTypes>('warn')

function switchState(state: stateTypes) {
  curState.value = state
  console.log(state)
  emitter.emit('panelChange', state)
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
    <PanelView :state="curState" @arc-click="switchState" />
  </main>
  <FooterView :state="curState" @live-start="switchState('live')" />
</template>
<style scoped lang="scss">
.header-box {
  height: var(--header-height);
  z-index: 999;
  position: relative;
}
main {
  position: relative;
  height: calc(100% - var(--header-height));
}
.map-box {
  position: relative;
  padding: 10px;
  height: calc(100% - 20px);
  box-sizing: border-box;
  width: calc(100% - 20px);
  left: 10px;
  box-shadow: 0px 0px 20px 4px #001c40;
  background-color: #174d4e;
  box-sizing: border-box;
}
</style>
