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

const img_url =
  'http://47.104.134.41:9000/cloud-bucket/wayline/402b20a5-74c6-4c78-bd84-a7b7e52d1131/DJI_202304231706_013_402b20a5-74c6-4c78-bd84-a7b7e52d1131/DJI_20230423170741_0008_W.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20230424%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230424T025744Z&X-Amz-Expires=600000&X-Amz-SignedHeaders=host&X-Amz-Signature=e9e30f089b6e97cf225f5a504d964a46608f6c95df228793c64667055c18f124'
const photos = [img_url, img_url]
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
