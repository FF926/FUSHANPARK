<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 08:46:33
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-15 16:50:05
 * @FilePath: \ace-firefly\src\components\PanelWarn.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <div class="main-box">
    <!-- <el-form class="my-form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date1"
            type="date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" placeholder="Pick a time" style="width: 100%" />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form> -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column align="center" type="index" width="55" label="序号" />
      <el-table-column align="center" prop="time" label="预警时间" />
      <el-table-column align="center" prop="coordinate" width="98" label="坐标" />
      <!-- <el-table-column align="center" prop="processingStatus" label="处理状态">
        <template slot-scope="scope">
          <el-select placeholder="请选择" filterable allow-create>
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
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
import { ElMessage, ElMessageBox } from 'element-plus'

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
