<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-15 14:28:08
 * @FilePath: \ace-firefly\src\components\MainMap.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by error: git config user.name && git config user.email & please set dead value or install git, All Rights Reserved. 
-->
<script setup lang="ts">
import MainMap, { jsonToTable, parseProp } from './module/MainMap'
import { ref, onMounted } from 'vue'
import { unByKey } from 'ol/Observable'
import Overlay from 'ol/Overlay'
import OLMeasure from '@/extensions/OLMeasure'

let mainMap: MainMap
let popupInfo = ref('')

let OLMeasureImpl: OLMeasure

let mapClickListen = ref(false)
let showMousePosition = ref(false)
let activeTool = ref<Set<string>>(new Set())

let clickEvt: any = null
// 配置里的首个矢量图层
let curLayer = ''

// 地图弹窗相关
let overlay = new Overlay({})
const container = ref<HTMLDivElement>()
const closer = ref<HTMLDivElement>()

onMounted(() => {
  mainMap = new MainMap('ol-map-container')
  // 浮窗
  overlay = new Overlay({
    element: container.value,
    autoPan: {
      animation: {
        duration: 250
      }
    }
  })
  mainMap.map.addOverlay(overlay)

  const measureLayer = mainMap.addTempVecLayer('measureLayer')
  OLMeasureImpl = new OLMeasure(mainMap.map, measureLayer)
})

/**
 * 地图识别
 * @param flag 启动/关闭地图识别
 */
function identify(flag: boolean) {
  if (flag) {
    // 启动
    startMapClickQuery()
  } else {
    unByKey(clickEvt)
    // 停止
    popupInfo.value = ''
    popupClose()
  }
  mapClickListen.value = flag
}

function startMapClickQuery() {
  // 初始化图层点击事件
  clickEvt = mainMap.addClickListenerToLayer(curLayer, onClick, onBlank)

  function onClick(data: any) {
    zoomTo(data.features[0].getGeometry())
    // 解析点击的要素 移除几何
    const properties = parseProp(data.features)
    if (mapClickListen.value) {
      popupInfo.value = jsonToTable(properties).innerHTML
      overlay.setPosition(data.event.coordinate)
    }
  }
  function onBlank() {
    // 点空白区域重置浮窗
    popupInfo.value = ''
    popupClose()
  }

  function zoomTo(geom: any) {
    mainMap.map.getView().fit(geom, { duration: 300, padding: [400, 400, 400, 400] })
  }
}

function popupClose() {
  overlay.setPosition(undefined)
  closer.value!.blur()
}

const tools = {
  reset: {
    name: '复位',
    icon: 'reset',
    fun: () => {
      mainMap.reset()
    }
  },
  layerSwitch: {
    name: '底图切换',
    icon: 'layerSwitch',
    fun: () => {
      mainMap.switchBaseLayer()
    }
  },
  length: {
    name: '长度测量',
    icon: 'length',
    fun: () => {
      if (activeTool.value.has('length')) {
        if (OLMeasureImpl) OLMeasureImpl.closeMeasure()
        activeTool.value.delete('length')
      } else if (activeTool.value.has('area')) {
        OLMeasureImpl.addInteraction('length')
        activeTool.value.delete('area')
        activeTool.value.add('length')
      } else {
        mainMap.reorderLayerToTop('measureLayer')
        OLMeasureImpl.startMeasure('length')
        activeTool.value.add('length')
      }
    }
  },
  area: {
    name: '面积测量',
    icon: 'area',
    fun: () => {
      if (activeTool.value.has('area')) {
        if (OLMeasureImpl) OLMeasureImpl.closeMeasure()
        activeTool.value.delete('area')
      } else if (activeTool.value.has('length')) {
        OLMeasureImpl.addInteraction('area')
        activeTool.value.delete('length')
        activeTool.value.add('area')
      } else {
        mainMap.reorderLayerToTop('measureLayer')
        OLMeasureImpl.startMeasure('area')
        activeTool.value.add('area')
      }
    }
  },
  locate: {
    name: '鼠标定位',
    icon: 'locate',
    fun: () => {
      showMousePosition.value = !showMousePosition.value
      showMousePosition.value ? activeTool.value.add('locate') : activeTool.value.delete('locate')
    }
  }
}
</script>

<template>
  <div class="ol-map">
    <div id="ol-map-container"></div>
    <div id="mouse-position" v-show="showMousePosition"></div>
  </div>

  <div ref="container" id="ol-popup" class="ol-popup">
    <a href="#" ref="closer" class="ol-popup-closer" @click.stop="popupClose"></a>
    <div class="ol-popup-info">
      <table class="coustum-table" v-html="popupInfo"></table>
    </div>
  </div>

  <div class="tools">
    <span
      v-for="(val, key) in tools"
      :key="key"
      :class="['btn-icon', val.icon, { active: activeTool.has(key) }]"
      @click="val.fun"
      :title="val.name"
    ></span>
  </div>
</template>
<style lang="scss" scoped>
@import url('../assets/styles/ol-popup.css');
.ol-map,
#ol-map-container {
  position: relative;
  height: 100%;
  width: 100%;
}
#mouse-position {
  position: fixed;
  z-index: 999;
  right: 15px;
  bottom: 15px;
  color: white;
}

.el-select.filter-select {
  z-index: 99999;
  position: absolute;
  left: 451px;
  top: 14px;
}

.tools {
  position: absolute;
  z-index: 10;
  border: 1px solid #3074b1;
  background-color: rgb(4 18 63 / 23%);
  border-radius: 5px;
  padding: 0px 5px;
  bottom: 0;
  right: 15%;
  display: inline-flex;
  .btn-icon {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 25px;
    height: 25px;
    display: block;
    cursor: pointer;
    margin: 5px 10px;
    &.active {
      box-shadow: 0 0 5px 5px #1995d3;
      border-radius: 20%;
    }
  }
  .reset {
    background-image: url('../assets/images/icon/reset.svg');
  }
  .layerSwitch {
    background-image: url('../assets/images/icon/layerSwitch.svg');
  }
  .length {
    background-image: url('../assets/images/icon/length.svg');
  }
  .area {
    background-image: url('../assets/images/icon/area.svg');
  }
  .locate {
    background-image: url('../assets/images/icon/locate.svg');
  }
}
</style>
