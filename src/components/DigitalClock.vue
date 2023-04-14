<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-12 14:12:51
 * @FilePath: \ace-firefly\src\components\DigitalClock.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by error: git config user.name && git config user.email & please set dead value or install git, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import moment from 'moment'
const h = () => new Date().getHours()
const m = () => new Date().getMinutes()
const s = () => new Date().getSeconds()
const y = () => new Date().getFullYear()
const mon = () => new Date().getMonth() + 1
const d = () => new Date().getDate()

const getTime = () => `${h()}:${m()}:${s()}`
const getDate = () => `${y()}/${mon()}/${d()}`
let time = ref(getTime())
let date = ref(getDate())

onMounted(() => {
  setInterval(() => {
    time.value = getTime()
    date.value = getDate()
  }, 1000)
})
</script>

<template>
  <div class="clock">
    <div class="date">{{ date }}</div>
    <div class="time">{{ time }}</div>
  </div>
</template>
<style scoped>
.clock {
  color: white;
  font-family: SupermolotLight;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 200px;
  margin-right: 1rem;
  margin-left: 2rem;
}
.date,
.time {
  font-size: 20px;
  padding-right: 5px;
}
</style>
