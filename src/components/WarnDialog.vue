<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-24 13:12:25
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-25 17:14:29
 * @FilePath: \ace-firefly\src\components\WarnDialog.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <!-- <div class="wrapper" v-if="props.showImage">
    <div :class="['my-dialog', { active: props.showImage }]">
      <div class="close-btn" @click="close">
        <el-icon><Close /></el-icon>
      </div>
    </div>
  </div> -->
  <el-dialog
    v-model="props.showImage"
    title="查看图片"
    width="75%"
    top="5vh"
    class="my-dialog"
    :before-close="close"
  >
    <el-carousel height="75vh" :autoplay="false">
      <el-carousel-item v-for="item in photos" :key="item">
        <img class="warn-img" :src="item" alt="" />
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{ showImage: boolean; warnInfo: any }>()
const emit = defineEmits(['close'])

const minio = 'http://47.104.134.41:9000/cloud-bucket/'

const _t =
  'wayline/402b20a5-74c6-4c78-bd84-a7b7e52d1131/DJI_202304231706_013_402b20a5-74c6-4c78-bd84-a7b7e52d1131/DJI_20230423170759_0011_T.jpeg'

const _w =
  'snipImg/DJI_202304231706_013_402b20a5-74c6-4c78-bd84-a7b7e52d1131/DJI_20230423170759_0011_W.jpeg'
const photos = [minio + _t, minio + _w]
function close() {
  emit('close')
}

function onCreated() {
  if (props.warnInfo) {
    console.log(props.warnInfo)
  }
}

onCreated()
</script>
<style scoped lang="scss">
.warn-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 75vh;
}
</style>
