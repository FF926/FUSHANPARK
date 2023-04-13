<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-13 17:47:24
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

function arcClick(state: stateTypes) {
  curState.value = state
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
    <div :class="['pannel', 'left', { active: curState === 'warn' }]">
      <div class="arc" @click="arcClick('warn')">
        <div class="arc-label">
          <div class="label-text">预警信息</div>
        </div>
        <div class="content-box">
          <div class="content"></div>
        </div>
      </div>
    </div>
    <div :class="['pannel', 'right', { active: curState === 'manage' }]">
      <div class="arc" @click="arcClick('manage')">
        <div class="arc-label">
          <div class="label-text">数据管理</div>
        </div>
        <div class="content-box">
          <div class="content"></div>
        </div>
      </div>
    </div>
  </main>
  <FooterView :state="curState" @live-start="arcClick('live')" />
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
  width: calc(100% - 20px);
  left: 10px;
  box-shadow: 0px 0px 20px 4px #001c40;
  background-color: #174d4e;
  box-sizing: border-box;
}
.pannel {
  position: absolute;
  height: calc(100% - var(--header-height));
  bottom: 0;
  z-index: 999;
  display: inline-flex;
  transition: 0.3s;
  &.left {
    left: 0;
    .arc {
      -moz-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      transform: scaleX(-1);
    }
    .arc-label {
      -moz-transform: scaleX(-1);
      -webkit-transform: scaleX(-1);
      -o-transform: scaleX(-1);
      transform: scaleX(-1);
      margin-left: 60%;
    }
  }
  &.right {
    right: 0;
  }
  .content-box {
    height: 101%;
    width: 20rem;
    background-color: #00629b;
    margin-left: 245%;
    margin-top: -8%;
    .content {
      height: 98%;
      top: 0%;
      position: absolute;
      width: 311%;
      margin-left: -125%;
    }
  }
  .arc {
    width: 7rem;
    height: 100%;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 99%;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-image: url('../assets/images/arc.png');
      top: -2%;
    }
    &::after {
      content: '';
      width: 240%;
      height: 101%;
      position: absolute;
      left: 16px;
      top: -1%;
      z-index: -1;
      border-radius: 80% 0px 0px 80%;
      background: linear-gradient(90deg, rgba(4, 63, 93, 0.88), rgba(0, 98, 155, 0.88), #00629b);
    }
  }
}
.arc-label {
  display: flex;
  align-items: center;
  position: absolute;
  width: 20px;
  color: white;
  height: 100%;
  margin-left: 40%;

  .label-text {
    font-size: 22px;
    font-weight: lighter;
    padding: 10px;
    background-color: #0286f95c;
    border: 0.5px solid #0b92f5;
  }
}

.active {
  &.left {
    left: 20%;
  }
  &.right {
    right: 20%;
  }
}
</style>
