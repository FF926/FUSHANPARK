<template>
  <div class="flex-column flex-justify-start flex-align-center mt20">
    <video
      :style="{ width: '630px', height: '420px' }"
      id="video-webrtc"
      ref="videowebrtc"
      controls
    ></video>
    <p class="fz24">请选择直播源</p>
    <div class="flex-row flex-justify-center flex-align-center mt10">
      <template v-if="liveState && isDockLive">
        <span class="mr10" style="color:white">请选择镜头:</span>
        <a-radio-group v-model:value="lensSelected" button-style="solid">
          <a-radio-button v-for="lens in lensList" :key="lens" :value="lens">{{lens}}</a-radio-button>
        </a-radio-group>
      </template>
      <template v-else>
      <!-- <a-select
        style="width: 150px"
        placeholder="请选择直播类型"
        @select="onLiveTypeSelect"
        v-model:value="livetypeSelected"
      >
        <a-select-option
          v-for="item in liveTypeList"
          :key="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select> -->
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="请选择设备"
        v-model:value="droneSelected"
      >
        <a-select-option
          v-for="item in droneList"
          :key="item.value"
          :value="item.value"
          @click="onDroneSelect(item)"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <a-select
        class="ml10"
        style="width:150px;"
        placeholder="请选择镜头"
        v-model:value="cameraSelected"
      >
        <a-select-option
          v-for="item in cameraList"
          :key="item.value"
          :value="item.value"
          @click="onCameraSelect(item)"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <!-- <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Lens"
        v-model:value="videoSelected"
      >
        <a-select-option
          v-for="item in videoList"
          :key="item.value"
          :value="item.value"
          @click="onVideoSelect(item)"
          >{{ item.label }}</a-select-option
        >
      </a-select> -->
      </template>
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="请选择清晰度"
        @select="onClaritySelect"
        v-model:value="claritySelected"
      >
        <a-select-option
          v-for="item in clarityList"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
    </div>
    <div class="mt20">
      <p class="fz10" v-if="livetypeSelected == 2">
        Please use VLC media player to play the RTSP livestream !!!
      </p>
      <p class="fz10" v-if="livetypeSelected == 2">
        RTSP Parameter:{{ rtspData }}
      </p>
    </div>
    <div class="mt10 flex-row flex-justify-center flex-align-center">
      <a-button v-if="liveState && isDockLive" type="primary" large @click="onSwitch">点击切换镜头</a-button>
      <a-button v-else type="primary" large @click="onStart">播放</a-button>
      <a-button class="ml20" type="primary" large @click="onStop"
        >暂停</a-button
      >
      <a-button class="ml20" type="primary" large @click="onUpdateQuality"
        >更新清晰度</a-button
      >
      <a-button v-if="!liveState || !isDockLive" class="ml20" type="primary" large @click="onRefresh"
        >刷新</a-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { CURRENT_CONFIG as config } from '@/api/http/config'
import { changeLivestreamLens, getLiveCapacity, setLivestreamQuality, startLivestream, stopLivestream } from '@/api/manage'
import { getRoot } from '@/root'
import jswebrtc from '@/vendors/jswebrtc.min.js'
const root = getRoot()

interface SelectOption {
  value: any,
  label: string,
  more?: any
}

const liveTypeList: SelectOption[] = [
  {
    value: 1,
    label: 'RTMP'
  },
  // {
  //   value: 2,
  //   label: 'RTSP'
  // },
  // {
  //   value: 3,
  //   label: 'GB28181'
  // }
]
const clarityList: SelectOption[] = [
  {
    value: 0,
    label: '自适应'
  },
  {
    value: 1,
    label: '流畅'
  },
  {
    value: 2,
    label: '标准'
  },
  {
    value: 3,
    label: '高清'
  },
  {
    value: 4,
    label: '超清'
  }
]

const videowebrtc = ref(null)
const livestreamSource = ref()
const droneList = ref()
const cameraList = ref()
const videoList = ref()
const droneSelected = ref()
const cameraSelected = ref()
const videoSelected = ref()
const claritySelected = ref()
const videoId = ref()
const liveState = ref<boolean>(false)
const livetypeSelected = ref(1)
const rtspData = ref()
const lensList = ref<string[]>([])
const lensSelected = ref<String>()
const isDockLive = ref(false)
const nonSwitchable = 'normal'

const onRefresh = async () => {
  droneList.value = []
  cameraList.value = []
  videoList.value = []
  droneSelected.value = null
  cameraSelected.value = null
  videoSelected.value = null
  await getLiveCapacity({})
    .then(res => {
      console.log(res)
      if (res.code === 0) {
        if (res.data === null) {
          console.warn('警告:获取直播失败!')
          return
        }
        const resData: Array<[]> = res.data
        console.log('live_capacity:', resData)
        livestreamSource.value = resData

        const temp: Array<SelectOption> = []
        if (livestreamSource.value) {
          livestreamSource.value.forEach((ele: any) => {
            temp.push({ label: ele.name + '-' + ele.sn, value: ele.sn, more: ele.cameras_list })
          })
          droneList.value = temp
        }
      }
    })
    .catch(error => {
      message.error(error)
      console.error(error)
    })
}

onMounted(() => {
  onRefresh()
})
const onStart = async () => {
  console.log(
    'Param:',
    livetypeSelected.value,
    droneSelected.value,
    cameraSelected.value,
    videoSelected.value,
    claritySelected.value
  )
  const timestamp = new Date().getTime().toString()
  if (
    livetypeSelected.value == null ||
    droneSelected.value == null ||
    cameraSelected.value == null ||
    claritySelected.value == null
  ) {
    message.warn('警告:未选择直播')
    return
  }
  videoId.value =
    droneSelected.value + '/' + cameraSelected.value + '/' + (videoSelected.value || nonSwitchable + '-0')

  let liveURL = ''
  switch (livetypeSelected.value) {
    case 1: {
      // RTMP
      liveURL = config.rtmpURL + timestamp
      break
    }
    case 2: {
      // RTSP
      liveURL = `userName=${config.rtspUserName}&password=${config.rtspPassword}&port=${config.rtspPort}`
      break
    }
    case 3: {
      liveURL = `serverIP=${config.gbServerIp}&serverPort=${config.gbServerPort}&serverID=${config.gbServerId}&agentID=${config.gbAgentId}&agentPassword=${config.gbPassword}&localPort=${config.gbAgentPort}&channel=${config.gbAgentChannel}`
      break
    }
    default:
      console.warn('warning: live type is not correct!!!')
      break
  }
  await startLivestream({
    url: liveURL,
    video_id: videoId.value,
    url_type: livetypeSelected.value,
    video_quality: claritySelected.value
  })
    .then(res => {
      if (res.code !== 0) {
        return
      }
      if (livetypeSelected.value === 3) {
        const url = res.data.url
        const videoElement = videowebrtc.value
        // gb28181,it will fail if not wait.
        message.loading({
          content: 'Loding...',
          duration: 4,
          onClose () {
            const player = new jswebrtc.Player(url, {
              video: videoElement,
              autoplay: true,
              onPlay: (obj: any) => {
                console.log('start play livestream')
              }
            })
          }
        })
      } else if (livetypeSelected.value === 2) {
        console.log(res)
        rtspData.value =
          'url:' +
          res.data.url +
          '&username:' +
          res.data.username +
          '&password:' +
          res.data.password
      } else if (livetypeSelected.value === 1) {
        const url = res.data.url
        const videoElement = videowebrtc.value
        console.log('start live:', url)
        console.log(videoElement)
        const player = new jswebrtc.Player(url, {
          video: videoElement,
          autoplay: true,
          onPlay: (obj: any) => {
            console.log('start play livestream')
          }
        })
      }
      liveState.value = true
    })
    .catch(err => {
      console.error(err)
    })
}
const onStop = () => {
  videoId.value =
    droneSelected.value + '/' + cameraSelected.value + '/' + (videoSelected.value || nonSwitchable + '-0')

  stopLivestream({
    video_id: videoId.value
  }).then(res => {
    if (res.code === 0) {
      message.success(res.message)
      liveState.value = false
      lensSelected.value = undefined
      console.log('stop play livestream')
    }
  })
}

const onUpdateQuality = () => {
  if (!liveState.value) {
    message.info('请先打开直播.')
    return
  }
  setLivestreamQuality({
    video_id: videoId.value,
    video_quality: claritySelected.value
  }).then(res => {
    if (res.code === 0) {
      message.success('清晰度切换至' + clarityList[claritySelected.value].label)
    }
  })
}

// const onLiveTypeSelect = (val: any) => {
//   livetypeSelected.value = val
// }
const onDroneSelect = (val: SelectOption) => {
  droneSelected.value = val.value
  const temp: Array<SelectOption> = []
  cameraList.value = []
  cameraSelected.value = undefined
  videoSelected.value = undefined
  videoList.value = []
  lensList.value = []
  if (!val.more) {
    return
  }
  val.more.forEach((ele: any) => {
    temp.push({ label: ele.name, value: ele.index, more: ele.videos_list })
  })
  cameraList.value = temp
}
const onCameraSelect = (val: SelectOption) => {
  cameraSelected.value = val.value
  const result: Array<SelectOption> = []
  videoSelected.value = undefined
  videoList.value = []
  lensList.value = []
  if (!val.more) {
    return
  }

  val.more.forEach((ele: any) => {
    result.push({ label: ele.type, value: ele.index, more: ele.switch_video_types })
  })
  videoList.value = result
  if (videoList.value.length === 0) {
    return
  }
  const firstVideo: SelectOption = videoList.value[0]
  videoSelected.value = firstVideo.value
  lensList.value = firstVideo.more
  lensSelected.value = firstVideo.label
  isDockLive.value = lensList.value.length > 0
}
const onVideoSelect = (val: SelectOption) => {
  videoSelected.value = val.value
  lensList.value = val.more
  lensSelected.value = val.label
}
const onClaritySelect = (val: any) => {
  claritySelected.value = val
}
const onSwitch = () => {
  if (lensSelected.value === undefined || lensSelected.value === nonSwitchable) {
    message.info('The ' + nonSwitchable + ' lens cannot be switched, please select the lens to be switched.', 8)
    return
  }
  changeLivestreamLens({
    video_id: videoId.value,
    video_type: lensSelected.value
  }).then(res => {
    if (res.code === 0) {
      message.success('切换镜头成功')
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
.fz24{
  color: white;
  margin: 10px 0;
}
</style>
