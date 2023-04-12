<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-12 11:57:00
 * @FilePath: \ace-firefly\src\components\HeaderView.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by error: git config user.name && git config user.email & please set dead value or install git, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue'
import DigitalClock from './DigitalClock.vue'

const title = ref('无人机巡检')

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
    <div class="item home h-btn">
      <span class="icon"></span>
      <a class="label">返回</a>
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
  height: 100%;
  width: 100%;
  display: inline-flex;
  flex-direction: row;
  background-image: url('../assets/images/header.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: white;
  cursor: default;
  font-family: txw;
  align-items: center;
  justify-content: flex-end;
}
.header .item {
  display: flex;
  align-items: center;
  .label {
    font-size: 15px;
  }
}

.full-size {
  right: 170px;
}
.icon {
  display: inline-block;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.home .icon {
  background-image: url('../assets/images/home-icon.png');
}
.full-size .icon {
  margin-right: 0;
  background-image: url('../assets/images/full-icon.png');
}
.title {
  position: absolute;
  left: 2rem;
  font-family: txw;
  font-size: 27px;
  color: white;
  text-shadow: 0 0 7px $greenGlow;
}
.clock {
  margin-right: 3rem;
}
</style>
