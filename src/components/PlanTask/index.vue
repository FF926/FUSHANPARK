<!--
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-13 10:37:34
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-14 14:02:53
 * @FilePath: \ace-firefly\src\components\PlanTask\index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
  <div>
    <a-modal title="航线计划" :width="1500" v-model:visible="visible" :footer="null">
      <a-button type="primary" @click="handlePlan">新建航线</a-button>
      <CreatePlan ref="plan" />
      <TaskPlanLibrary />
      <!-- <Tsa /> -->
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import CreatePlan from './CreatePlan.vue'
import TaskPlanLibrary from './TaskPlanLibrary.vue'
import Tsa from './Device/tsa.vue'
const plan = ref<InstanceType<typeof CreatePlan>>() //泛类型   <typeof>
/* 开启弹窗 */
const handlePlan = () => {
  plan.value.planVisible = !plan.value?.planVisible
}
const visible = ref<boolean>(true)
defineExpose({
  visible
})
</script>
<style lang="scss"></style>
