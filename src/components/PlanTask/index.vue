<!--
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-13 10:37:34
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-14 14:52:42
 * @FilePath: \ace-firefly\src\components\PlanTask\index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div>
    <a-modal title="航线计划" :width="1500" v-model:visible="visible" :footer="null">
      <a-button style="margin-right:10px;" type="primary" @click="handlePlan">新建航线</a-button>
      <a-button type="primary" @click="handleTsa">在线设备</a-button>
      <CreatePlan ref="plan" />
      <TsaDevice ref="tsa" />
      <TaskPlanLibrary />
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CreatePlan from './CreatePlan.vue'
import TaskPlanLibrary from './TaskPlanLibrary.vue'
import TsaDevice from './Device/TsaDevice.vue'
const plan = ref<InstanceType<typeof CreatePlan>>() //泛类型   <typeof>
const tsa = ref<InstanceType<typeof TsaDevice>>() //泛类型   <typeof>
/* 开启弹窗 */
const handlePlan = () => {
  plan.value.planVisible = !plan.value?.planVisible
}
const handleTsa = () => {
  tsa.value.tsaVisible = !plan.value?.planVisible
}
const visible = ref<boolean>(false)
defineExpose({
  visible
})
</script>
<style lang="scss"></style>
