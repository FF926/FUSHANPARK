<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 09:19:55
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-14 10:18:46
 * @FilePath: \ace-firefly\src\views\PanelView.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div :class="['panel', 'left', { active: props.state === 'warn' }]">
    <div class="content">
      <PanelWarn />
    </div>
    <div class="arc" @click="arcClick('warn')">
      <div class="label-text">预警信息</div>
    </div>
  </div>
  <div :class="['panel', 'right', { active: props.state === 'manage' }]">
    <div class="arc" @click="arcClick('manage')">
      <div class="label-text">数据管理</div>
    </div>
    <div class="content">
      <PanelManage />
    </div>
  </div>
</template>

<script setup lang="ts">
import PanelWarn from '../components/PanelWarn.vue'
import PanelManage from '../components/PanelManage.vue'
import type { stateTypes } from '@/views/HomeView.vue'

const props = defineProps<{
  state: stateTypes
}>()

const emit = defineEmits<{
  (e: 'arcClick', type: stateTypes): void
}>()

function arcClick(params: stateTypes) {
  emit('arcClick', params)
}
</script>
<style scoped lang="scss">
.active {
  &.left {
    left: 0 !important;
  }
  &.right {
    right: 0 !important;
  }
}
.panel {
  position: absolute;
  width: 25%;
  height: 98%;
  z-index: 1;
  top: 0;
  display: inline-flex;
  transition: 0.3s;
  &.left {
    left: -22%;
  }
  &.right {
    right: -22%;
  }
}
.content {
  width: 80%;
  height: 100%;
  background-color: #00629b;
  position: relative;
}
.arc {
  width: 20%;
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    position: absolute;
    width: 7rem;
    height: 100%;
    transform: scaleX(-1);
    margin-left: 3.2rem;
    margin-top: -5%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url('../assets/images/arc.png');
  }
  &::after {
    content: '';
    width: 15rem;
    height: 100%;
    position: absolute;
    z-index: -1;
    margin-left: -6rem;
    border-radius: 0px 80% 80% 0px;
    background: linear-gradient(90deg, #00629b, rgba(0, 98, 155, 0.97), rgba(4, 63, 93, 0.7));
  }
}
.right {
  .arc,
  .label-text {
    transform: scaleX(-1);
  }
}
.label-text {
  font-size: 22px;
  font-weight: lighter;
  padding: 10px;
  background-color: #0286f95c;
  border: 0.5px solid #0b92f5;
  color: white;
  margin-left: 5rem;
  margin-top: 12px;
  border-radius: 5px;
}
</style>
