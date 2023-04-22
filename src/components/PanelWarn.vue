<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 08:46:33
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-22 17:49:52
 * @FilePath: \ace-firefly\src\components\PanelWarn.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <div class="main-box" ref="refPanelManage">
    <el-form class="my-form" :model="form1" label-width="120px">
      <!-- <el-form-item label="时间范围">
        <el-date-picker v-model="form1.date" type="datetimerange" placeholder="请选择" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="selectAll">全选</el-button>
        <el-button type="danger" @click="deleteWarnInfo">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTableRef" :height="domHeight" :data="warninginfo" style="width: 100%">
      <el-table-column type="selection" width="26" />
      <el-table-column align="center" type="index" width="55" label="序号" />
      <el-table-column align="center" prop="create_time" width="150" label="预警时间" />
      <el-table-column align="center" prop="longitude" width="98" label="经度" />
      <el-table-column align="center" prop="latitude" width="98" label="纬度" />
      <el-table-column prop="status" width="105" label="处理状态">
        <template #default="{ row }">
          <el-select
            v-model="row.status"
            @change="updateStatus(row)"
            :disabled="row.status ? true : false"
          >
            <el-option label="已处理" :value="3"></el-option>
            <el-option label="误报" :value="2"></el-option>
            <el-option label="未处理" :value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
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
    <div class="pager">
      <el-pagination
        v-model:current-page="paginationProp.current"
        v-model:page-size="paginationProp.pageSize"
        :page-sizes="paginationProp.pageSizeOptions"
        :small="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationProp.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getWarnList, deleteWarn, updateWarnStatus } from '@/api/project'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import { message } from 'ant-design-vue'

// const centerDialogVisible = ref(true)
// function isProcess() {
//   console.log(111)
//   open()
// }
const paginationProp = reactive({
  pageSizeOptions: [10, 20, 50, 100],
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: 10,
  current: 1,
  total: 0
})
// const open = () => {
//   ElMessageBox.confirm('请确认本条预警信息是否误报', '提示', {
//     confirmButtonText: '是',
//     cancelButtonText: '否',
//     type: 'warning'
//   })
//     .then(() => {
//       ElMessage({
//         type: 'success',
//         message: '是误报'
//       })
//     })
//     .catch(() => {
//       ElMessage({
//         type: 'info',
//         message: '不是误报'
//       })
//     })
// }
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
interface WarningInfo {
  id: number
  picture_file: string
  create_time: string
  longitude: string
  update_time: string
  status: number
  latitude: string
  height: string
}
const warninginfo = ref([] as WarningInfo[])
// do not use same name with ref
const form1 = reactive({
  date: ''
})
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

function selectAll() {
  multipleTableRef.value!.toggleAllSelection()
}
const refPanelManage = ref<HTMLDivElement>()
const domHeight = ref(0)

onMounted(() => {
  getWarnings()
  domHeight.value = refPanelManage.value?.offsetHeight! + 450
})

async function doGetWarnList(params: any) {
  const data = await getWarnList({ page: 1, page_size: 20 })
  console.log(data)
}
function handleSizeChange() {
  getWarnings()
}
function getWarnings() {
  const body = {
    page: paginationProp.current,
    total: 0,
    page_size: paginationProp.pageSize
  }
  console.log(body)

  getWarnList(body).then((res) => {
    warninginfo.value = res.data.records
    console.log(warninginfo.value)
    paginationProp.total = res.data.total
    paginationProp.current = res.data.current
  })
}
function handleCurrentChange() {
  getWarnings()
}
/* 状态更新 */
function updateStatus(row: any) {
  console.log(row)

  const body = {
    status: row.status,
    id: row.id
  }
  updateWarnStatus(body).then((res) => {
    if (res.code == 0) {
      message.success('状态更新成功')
      getWarnings()
    } else {
      message.error('状更新失败')
    }
  })
}
/* 删除信息 */
function deleteWarnInfo() {
  ElMessageBox.confirm('确认删除选中的信息？')
    .then(() => {
      console.log(multipleTableRef.value!.getSelectionRows())
      const body = {
        id: multipleTableRef.value!.getSelectionRows()[0].id
      }
      deleteWarn(body).then((res) => {
        if (res.code == 0) {
          ElMessage({ type: 'success', message: '删除成功' })
          getWarnings()
        }
      })
    })
    .catch(() => {
      ElMessage('取消')
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
