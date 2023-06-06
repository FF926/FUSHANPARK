<!--
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 08:46:33
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-06-06 15:19:01
 * @FilePath: \ace-firefly\src\components\PanelManage.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<!--  -->
<template>
  <div class="main-box" ref="refPanelManage">
    <el-form class="my-form" :model="filter" label-width="120px">
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="filter.date"
          type="datetimerange"
          value-format="YYYY-MM-DD  HH:mm:ss"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSizeChange">查询</el-button>
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
      @row-click="onRowClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" type="index" width="53" label="序号" />
      <el-table-column
        v-for="item in dataTableCols"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      />
      <el-table-column
        v-if="!pictureFlag"
        align="center"
        prop="status"
        width="53"
        label="任务状态"
        :formatter="formatter"
      />
      <!-- <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" :text="true" @click="showDetail(scope.$index, scope.row)"
            >下载</el-button
          >
        </template>
      </el-table-column> -->
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
    <!-- <template v-if="showImage">
      <WarnDialog :show-image="showImage" :warn-info="clickedWarnInfo" @close="dialogeClose" />
    </template> -->
  </div>
</template>
<script setup lang="ts">
import WarnDialog from './WarnDialog.vue'
import { reactive, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ElTable } from 'element-plus'
import { downloadMediaFile, getMediaFiles } from '@/api/media'
import { downloadFile } from '@/utils/common'
import { formatDayTime, formatUnixTime } from '@/utils/time'
import { getJobFile, getWayLineJob, delMedia } from '@/api/project'
import { last } from 'lodash'
import { project_global } from '@/root'
import type MainMap from './module/MainMap'
import { login } from '@/api/manage'
import emitter from '@/event-bus'
import { Icon, Style } from 'ol/style'

const workspaceId = localStorage.getItem('workspace_id')!
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

const refPanelManage = ref<HTMLDivElement>()

const paginationProp = reactive({
  pageSizeOptions: [10, 20, 50, 100],
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: 20,
  current: 1,
  total: 0
})

const domHeight = ref(0)

const dataTableCols = ref()
const mapComp = ref<MainMap | null>(null)
const formatter = (row: any, column: any, cellValue: any, index: number) => {
  switch (cellValue) {
    case 1:
      return '待执行'
      break
    case 2:
      return '执行中'
      break
    case 3:
      return '完成'
      break
    case 4:
      return '取消'
      break
    case 5:
      return '失败'
      break
    default:
      break
  }
}
const flightTableCols = [
  {
    prop: 'name',
    label: '任务名称'
  },
  {
    prop: 'begin_time',
    label: '开始时间'
  },
  {
    prop: 'media_count',
    label: '照片数量'
  }
]
const pictureTableCols = [
  {
    prop: 'created_date',
    label: '拍摄时间'
  },
  {
    prop: 'lon',
    label: '经度'
  },
  {
    prop: 'lat',
    label: '纬度'
  }
]

const mediaData = reactive({
  data: [null, null]
})

onMounted(() => {
  emitter.on('panelChange', (e) => {
    if (e == 'manage') {
      console.log(e)
      flag.value = true
      pictureFlag.value = false
      getFiles()
    }
  })
  getFiles(job_id.value)
  mapComp.value = project_global.$map
  mapComp.value?.addClickListenerToLayer('photoLayer', (feature) => {
    /* ------点击预警要素弹出照片------ */
    onWarnClick(feature.features[0].getProperties())
  })
  domHeight.value = refPanelManage.value?.offsetHeight! - 200
})
const showImage = ref(false)
const clickedWarnInfo = ref<any>(null)
function onWarnClick(row: any) {
  console.log('row', row)

  clickedWarnInfo.value = row
  showImage.value = true
}
function dialogeClose() {
  clickedWarnInfo.value = null
  showImage.value = false
}

function handleSizeChange() {
  getFiles(job_id.value)
}

function handleCurrentChange() {
  getFiles(job_id.value)
}

/* ------获取列表信息------ */
const pictureFlag = ref(false)
function getFiles(job_id?: string) {
  console.log('job_id', job_id)

  if (!pictureFlag.value) {
    console.log('filter', filter.date)
    /* ------获取架次信息------ */
    const body = {
      Filters: [
        filter.date != null
          ? {
              field: 'begin_time',
              op: 'ge', //大于等于
              term: formatDayTime(filter.date[0])
            }
          : {
              field: 'begin_time',
              op: 'ne', //不等于
              term: '2000-01-01'
            },
        filter.date != null
          ? {
              field: 'begin_time',
              op: 'le', //小于等于
              term: formatDayTime(filter.date[1])
            }
          : {
              field: 'begin_time',
              op: 'ne', //不等于
              term: '2000-01-01'
            }
      ],
      index: paginationProp.current,
      size: paginationProp.pageSize
    }
    console.log('body', body)
    getWayLineJob(body).then((res) => {
      console.log(res)
      res.data.records.forEach((item: any) => {
        item.begin_time = formatUnixTime(item.begin_time / 1000)
        console.log(item.begin_time)
      })
      mediaData.data = res.data.records
      paginationProp.total = res.data.total

      dataTableCols.value = flightTableCols
    })
  } else {
    console.log('paginationProp', paginationProp)
    console.log(filter.date)

    /* ------根据架次job_id获取该架次的详细信息------ */
    const body1 = {
      index: paginationProp.current,
      size: paginationProp.pageSize,
      filters: [
        {
          field: 'job_id',
          op: 'eq',
          term: job_id
        },
        filter.date != null
          ? {
              field: 'create_time',
              op: 'ge', //大于等于
              term: String(formatDayTime(filter.date[0]))
            }
          : {
              field: 'create_time',
              op: 'ne', //不等于
              term: '2000-01-01'
            },
        filter.date != null
          ? {
              field: 'create_time',
              op: 'le', //小于等于
              term: String(formatDayTime(filter.date[1]))
            }
          : {
              field: 'create_time',
              op: 'ne', //不等于
              term: '2000-01-01'
            }
      ]
    }
    console.log('body1', body1)
    getJobFile(body1).then((res) => {
      console.log(res)
      mediaData.data = res.data.records

      mapComp.value?.addPhotoPin(res.data.records)
      console.log(mediaData.data)
      paginationProp.total = res.data.total
      dataTableCols.value = pictureTableCols
      /* 进入照片页面 */
      pictureFlag.value = true
      flag.value = true
    })
  }
}
/* job_id持久化 */
const job_id = ref()
const flag = ref(true)
function onRowClick(row: any) {
  console.log('flag.value', flag.value)

  if (!flag.value) {
    return
  }
  flag.value = false
  // setTimeout(() => {
  //   flag.value = true
  // }, 1000) // 1秒后将标志位设为true
  /* 非照片页面 */
  if (!pictureFlag.value) {
    /* 进入照片页面 */
    pictureFlag.value = true
    job_id.value = row.job_id
    getFiles(job_id.value)
  } else {
    // console.log(row)
    clickedWarnInfo.value = row
    flag.value = true

    mapComp.value?.setCenter([clickedWarnInfo.value.longitude, clickedWarnInfo.value.latitude])
    const ly = mapComp.value?.getTempVecLayer('photoLayer')
    const warnFeature = ly[0].getSource().getFeatureById(row.lat)
    const style = warnFeature?.getStyle()
    console.log(style.image_.opacity_)

    const styleOpacity = style.clone()
    styleOpacity.image_.opacity_ = 0.1
    // showImage.value = true
    /* ------点击该行对应的数据闪烁------ */
    // 定义计数器和计时器
    let count = 0
    const timer = setInterval(function () {
      if (count % 2 === 0) {
        warnFeature?.setStyle(styleOpacity)
        // console.log(warnFeature?.getStyle()?.getImage())
        warnFeature?.changed()
      } else {
        warnFeature?.setStyle(style)
        warnFeature?.changed()
      }
      count++
      if (count > 5) {
        clearInterval(timer)
      }
    }, 300)
  }
}
// do not use same name with ref
const filter = reactive({
  date: null
})

// function showDetail(idx: number, media: MediaFile) {
//   downloadMediaFile(workspaceId, media.file_id).then((res) => {
//     if (!res) {
//       return
//     }
//     const data = new Blob([res])
//     downloadFile(data, media.file_name)
//   })
// }

function selectAll() {
  multipleTableRef.value!.toggleAllSelection()
}

function doDelete() {
  const selected = multipleTableRef.value!.getSelectionRows()
  console.log('selected', selected)

  if (!selected || selected.length < 1) {
    ElMessage({
      type: 'info',
      message: '请选择需要删除的数据'
    })
    return
  }
  ElMessageBox.confirm('删除后不可恢复, 请确认?')
    .then(() => {
      if (pictureFlag.value) {
        let files: any = []
        selected.forEach((element: any) => {
          files.push(...element.files)
          console.log('files', files)
        })
        const body = {
          files: files
        }
        console.log('body', body)
        delMedia(body).then((res) => {
          console.log('res', res)
          if (res.message === 'success') {
            getFiles(job_id.value)
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            multipleTableRef.value!.clearSelection()
          }
        })
      } else {
        let job_ids: any = []
        selected.forEach((element: any) => {
          console.log('element', element)
          job_ids.push(element.job_id)
        })
        const body = {
          job_id: job_ids
        }
        console.log('body', body)

        delMedia(body).then((res) => {
          console.log('res', res)
          if (res.message === 'success') {
            getFiles()
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            multipleTableRef.value!.clearSelection()
          }
        })
      }
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
