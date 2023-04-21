<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 08:46:33
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-20 09:14:24
 * @FilePath: \ace-firefly\src\components\PanelWarn.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <div class="main-box">
    <el-form class="my-form" :model="form1" label-width="120px">
      <el-form-item label="时间范围">
        <el-date-picker v-model="form1.date" type="datetimerange" placeholder="请选择" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectAll">全选</el-button>
        <el-button type="danger" @click="doDelete">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="26" />
      <el-table-column align="center" type="index" width="55" label="序号" />
      <el-table-column align="center" prop="time" label="预警时间" />
      <el-table-column align="center" prop="coordinate" width="98" label="坐标" />
      <el-table-column prop="processingStatus" label="处理状态">
        <template #default="{ row }">
          <el-select v-model="row.processingStatus" :disabled="row.processingStatus ? true : false">
            <el-option label="已处理" :value="1" @click="isProcess"></el-option>
            <el-option label="未处理" :value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isFalse" width="80" label="是否误报" />
    </el-table>
    <!-- <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" align-center>
      <span>请确认本条预警信息是否误报</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="centerDialogVisible = false"> Confirm </el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'

// const centerDialogVisible = ref(true)
function isProcess() {
  console.log(111)
  open()
}
const open = () => {
  ElMessageBox.confirm('请确认本条预警信息是否误报', '提示', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '是误报'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '不是误报'
      })
    })
}
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]
const tableData = [
  {
    time: '2016-05-03 18:35:00',
    coordinate: '112.366633,30.3366633',
    processingStatus: 0, //0 未处理 1 已处理
    isFalse: '是'
  },
  {
    time: '2016-05-03 18:35:00',
    coordinate: '112.366633,30.3366633',
    processingStatus: 1, //0 未处理 1 已处理
    isFalse: '是'
  },
  {
    time: '2016-05-03 18:35:00',
    coordinate: '112.366633,30.3366633',
    processingStatus: 0, //0 未处理 1 已处理
    isFalse: '是'
  },
  {
    time: '2016-05-03 18:35:00',
    coordinate: '112.366633,30.3366633',
    processingStatus: 1, //0 未处理 1 已处理
    isFalse: '是'
  },
  {
    time: '2016-05-03 18:35:00',
    coordinate: '112.366633,30.3366633',
    processingStatus: 1, //0 未处理 1 已处理
    isFalse: '是'
  },
  {
    time: '2016-05-03 18:35:00',
    coordinate: '112.366633,30.3366633',
    processingStatus: 0, //0 未处理 1 已处理
    isFalse: '是'
  },
  {
    time: '2016-05-03 18:35:00',
    coordinate: '112.366633,30.3366633',
    processingStatus: 0, //0 未处理 1 已处理
    isFalse: '是'
  }
]

// do not use same name with ref
const form1 = reactive({
  date: ''
})
// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

function selectAll() {
  multipleTableRef.value!.toggleAllSelection()
}

function doDelete() {
  ElMessageBox.confirm('确认删除选中的信息？')
    .then(() => {
      console.log(multipleTableRef.value!.getSelectionRows())
      ElMessage({ type: 'success', message: '删除成功' })
    })
    .catch(() => {
      ElMessage('取消')
    })
}
const onSubmit = () => {
  console.log('submit!')
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
<style lang="scss">
.el-select .el-input.is-disabled .el-input__wrapper {
  background-color: rgba(0, 0, 0, 0);
  box-shadow: none;
}
.el-select .el-input .el-input__wrapper {
  background-color: rgba(23, 140, 218, 0.527);
  color: rgba(187, 19, 19, 0.603);
  box-shadow: 0 0 0 1px #0b92f5 inset;
  padding: 1px 6px;
}
</style>
