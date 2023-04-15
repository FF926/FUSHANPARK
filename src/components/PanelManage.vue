<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 08:46:33
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-15 15:00:24
 * @FilePath: \ace-firefly\src\components\PanelManage.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <div class="main-box">
    <el-form class="my-form" :model="form" label-width="120px">
      <el-form-item label="时间范围">
        <el-date-picker v-model="form.date" type="datetimerange" placeholder="请选择" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectAll">全选</el-button>
        <el-button type="danger" @click="doDelete">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      :show-overflow-tooltip="true"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="date" label="Date" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="address" label="Address" />
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" :text="true" @click="showDetail(scope.$index, scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ElTable } from 'element-plus'

const multipleTableRef = ref<InstanceType<typeof ElTable>>()

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

// do not use same name with ref
const form = reactive({
  date: ''
})

function showDetail(idx: number, row: any) {
  console.log(idx)
  console.log(row)
}

function selectAll() {
  multipleTableRef.value!.toggleAllSelection()
}

function doDelete() {
  ElMessageBox.confirm('确认删除选中的图片？')
    .then(() => {
      console.log(multipleTableRef.value!.getSelectionRows())

      alert('删除成功')
    })
    .catch(() => {
      alert('已取消')
    })
}
</script>
<style scoped lang="scss">
.main-box {
  width: 100%;
  padding: 10px;
}
.my-form {
  width: 95%;
}
</style>
