<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-12 15:39:16
 * @FilePath: \ace-firefly\src\components\HeaderView.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by error: git config user.name && git config user.email & please set dead value or install git, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue'
import DigitalClock from './DigitalClock.vue'

const title = ref('浮山公园无人机智慧防火平台')

// 网页全屏 开关
function setFullScreen() {
  const flag = isFullscreen()
  const iDocument = document as any
  const ele = iDocument.documentElement as any
  if (!flag) {
    if (ele.RequestFullScreen) {
      ele.RequestFullScreen()
    } else if (ele.mozRequestFullScreen) {
      //兼容火狐
      ele.mozRequestFullScreen()
    } else if (ele.webkitRequestFullScreen) {
      //兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
      ele.webkitRequestFullScreen()
    } else if (ele.msRequestFullscreen) {
      //兼容IE,只能写msRequestFullscreen
      ele.msRequestFullscreen()
    }
  } else {
    if (iDocument.exitFullScreen) {
      iDocument.exitFullscreen()
    } else if (iDocument.mozCancelFullScreen) {
      iDocument.mozCancelFullScreen()
    } else if (iDocument.webkitExitFullscreen) {
      iDocument.webkitExitFullscreen()
    } else if (iDocument.msExitFullscreen) {
      iDocument.msExitFullscreen()
    }
  }
}

function isFullscreen(): boolean {
  const ele = document as any
  return (
    ele.fullscreenElement ||
    ele.msFullscreenElement ||
    ele.mozFullScreenElement ||
    ele.webkitFullscreenElement ||
    false
  )
}
</script>

<template>
  <div class="header">
    <div class="title">
      {{ title }}
    </div>
    <div class="item home h-btn" title="返回首页">
      <span class="icon"></span>
    </div>
    <div class="item full-size h-btn" title="全屏" @click="setFullScreen()">
      <span class="icon"></span>
    </div>
    <DigitalClock />
  </div>
</template>
<style scoped lang="scss">
$greenGlow: #21f3e2;
.header {
  position: relative;
  display: inline-flex;
  height: 100%;
  width: 100%;
  background-image: url('../assets/images/header.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
  cursor: default;
}
.header .item {
  display: flex;
  align-items: center;
  margin: 0 12px;
  .label {
    font-size: 15px;
  }
}
.title {
  position: absolute;
  left: 1.5rem;
  letter-spacing: 4px;
  font-size: 25px;
  font-family: txw;
  color: white;
  text-shadow: 0 0 7px $greenGlow;
}
.h-btn {
  cursor: pointer;
  transition: 0.2s;
}
.h-btn:hover {
  transform: scale(1.2);
}
.icon {
  display: inline-block;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-right: 5px;
}
.home .icon {
  background-image: url('../assets/images/icon/home.svg');
  width: 25px;
  height: 25px;
}
.full-size .icon {
  background-image: url('../assets/images/icon/full-size.svg');
  width: 23px;
  height: 23px;
}
</style>
