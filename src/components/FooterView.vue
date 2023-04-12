<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-12 15:53:39
 * @FilePath: \ace-firefly\src\components\FooterView.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by error: git config user.name && git config user.email & please set dead value or install git, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue'
import type { stateTypes } from '@/views/HomeView.vue'

const connected = ref(true)

const props = defineProps<{
  state: stateTypes
}>()

const emit = defineEmits<{
  (e: 'liveStart'): void
}>()

function liveStart() {
  if (props.state !== 'live') {
    emit('liveStart')
  }
}
</script>

<template>
  <div class="footer">
    <div class="drone-cam" @click="liveStart">
      <span class="cam-icon"></span>
      <div class="label">视频直播</div>
      <span :class="['dot', { active: connected }]"></span>
    </div>
  </div>
</template>
<style scoped lang="scss">
$greenGlow: #21f3e2;
.footer {
  position: absolute;
  display: inline-flex;
  height: 3rem;
  width: 100%;
  bottom: 10px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-image: url('../assets/images/footer.png');
}
.cam-icon {
  background-image: url('../assets/images/icon/camera.svg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 25px;
  height: 25px;
}
.drone-cam {
  display: flex;
  align-items: center;
  cursor: pointer;
  .label {
    color: white;
    font-size: 20px;
    letter-spacing: 2px;
    margin: 0 0.5rem;
  }
  .dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-left: 0.5rem;
    border-radius: 50%;
    background-color: $greenGlow;
    box-shadow: 0px 0px 5px 5px $greenGlow;
    &.active {
      animation: mymove 7s ease-in-out infinite alternate;
      @keyframes mymove {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        25% {
          transform: scale(1.4);
          opacity: 1;
        }
        50% {
          transform: scale(1);
          opacity: 0.8;
        }
        75% {
          transform: scale(1.4);
          opacity: 1;
        }
      }
    }
  }
}
</style>
