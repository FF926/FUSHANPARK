<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 08:46:33
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-14 14:01:53
 * @FilePath: \ace-firefly\src\components\PanelLive.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <div class="live-main">
    <div class="video-box"></div>
    <div class="wait">
      <div class="drone-icon"></div>
      正在加载，请稍后
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
</script>
<style scoped lang="scss">
.live-main {
  position: relative;
  display: flex;
  height: 100%;
  justify-content: center;
}
.wait {
  position: absolute;
  width: 70%;
  height: 70%;
  text-align: center;
  font-size: 20px;
  line-height: 0px;
  .drone-icon {
    background-image: url('../assets/images/drone.svg');
    background-size: 40% 40%;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    text-align: center;
    background-position: 50% 50%;
    // animation: rotate 5s linear infinite;
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      100% {
        transform: rotate(0deg);
      }
    }
  }
}
.video-box {
  width: 90%;
  height: 75%;
  background-color: #b9b9b9;
}
</style>
