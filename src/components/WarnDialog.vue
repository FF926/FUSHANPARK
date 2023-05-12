<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-24 13:12:25
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-05-12 08:55:14
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
import { ref } from 'vue'
const props = defineProps<{ showImage: boolean; warnInfo: any }>()
const emit = defineEmits(['close'])
const minio = 'http://47.104.134.41:9000/cloud-bucket/'
const _t = ref()
const _w = ref()
const orgin_tfile = ref()
const orgin_wfile = ref()
const photos = ref<any>([])
function close() {
  emit('close')
}
function onCreated() {
  if (props.warnInfo) {
    console.log(props.warnInfo)
    /* 是否有file数组 */
    if (!props.warnInfo.files) {
      _t.value = props.warnInfo.tfile
      _w.value = props.warnInfo.wfile
      orgin_tfile.value = props.warnInfo.origin_tfile
      orgin_wfile.value = props.warnInfo.origin_wfile
      photos.value = [
        minio + _t.value,
        minio + _w.value,
        minio + orgin_tfile.value,
        minio + orgin_wfile.value
      ]
    } else {
      props.warnInfo.files.forEach((e: any) => {
        photos.value.push(minio + e.object_key)
      })
    }

    console.log(photos.value)
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
