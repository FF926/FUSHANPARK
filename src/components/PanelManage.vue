<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 08:46:33
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-22 15:46:06
 * @FilePath: \ace-firefly\src\components\PanelManage.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <div class="main-box" ref="refPanelManage">
    <el-form class="my-form" :model="form" label-width="120px">
      <!-- <el-form-item label="时间范围">
        <el-date-picker v-model="form.date" type="datetimerange" placeholder="请选择" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="selectAll">全选</el-button>
        <el-button type="danger" @click="doDelete">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTableRef"
      :data="mediaData.data"
      :show-overflow-tooltip="true"
      style="width: 100%"
      :height="domHeight"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        v-for="item in dataTableCols"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      />
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" :text="true" @click="showDetail(scope.$index, scope.row)"
            >下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElTable } from 'element-plus'
import { downloadMediaFile, getMediaFiles } from '@/api/media'
import { downloadFile } from '@/utils/common'

const workspaceId = localStorage.getItem('workspace_id')!

const multipleTableRef = ref<InstanceType<typeof ElTable>>()

const refPanelManage = ref<HTMLDivElement>()

const paginationProp = reactive({
  pageSizeOptions: [10, 20, 50, 100],
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: 50,
  current: 1,
  total: 0
})

const domHeight = ref(0)

const dataTableCols = [
  {
    prop: 'file_name',
    label: '文件名'
  },
  {
    prop: 'payload',
    label: '载荷类型'
  },
  {
    prop: 'create_time',
    label: '创建时间'
  }
]

interface MediaFile {
  fingerprint: string
  drone: string
  payload: string
  is_original: string
  file_name: string
  file_path: string
  create_time: string
  file_id: string
}

const mediaData = reactive({
  data: [] as MediaFile[]
})

onMounted(() => {
  getFiles()
  domHeight.value = refPanelManage.value?.offsetHeight! - 200
})

function handleSizeChange() {
  getFiles()
}

function handleCurrentChange() {
  getFiles()
}

function getFiles() {
  const body = {
    page: paginationProp.current,
    total: 0,
    page_size: paginationProp.pageSize
  }

  getMediaFiles(workspaceId, body).then((res) => {
    mediaData.data = res.data.list
    paginationProp.total = res.data.pagination.total
    paginationProp.current = res.data.pagination.page
  })
}

// do not use same name with ref
const form = reactive({
  date: ''
})

function showDetail(idx: number, media: MediaFile) {
  downloadMediaFile(workspaceId, media.file_id).then((res) => {
    if (!res) {
      return
    }
    const data = new Blob([res])
    downloadFile(data, media.file_name)
  })
}

function selectAll() {
  multipleTableRef.value!.toggleAllSelection()
}

function doDelete() {
  const selected = multipleTableRef.value!.getSelectionRows()
  if (!selected || selected.length < 1) {
    ElMessage({
      type: 'info',
      message: '请选择需要删除的图片'
    })
    return
  }
  ElMessageBox.confirm('确认删除选中的图片？')
    .then(() => {
      console.log(selected)
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      multipleTableRef.value!.clearSelection()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消'
      })
    })
}
</script>
<style scoped lang="scss">
.main-box {
  width: 100%;
  padding: 10px;
  height: 100%;
}
.my-form {
  width: 95%;
}
</style>
