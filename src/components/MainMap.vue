<!--
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-21 16:19:30
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-12 10:06:41
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

let mainMap: MainMap
let popupInfo = ref('')
let mapClickListen = ref(false)

let clickEvt: any = null
// 配置里的首个矢量图层
let curLayer = ''

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
</script>

<template>
  <div class="ol-map">
    <div id="ol-map-container"></div>
    <div id="mouse-position"></div>
  </div>

  <div ref="container" id="ol-popup" class="ol-popup">
    <a href="#" ref="closer" class="ol-popup-closer" @click.stop="popupClose"></a>
    <div class="ol-popup-info">
      <table class="coustum-table" v-html="popupInfo"></table>
    </div>
  </div>
</template>
<style scoped>
@import url('../assets/styles/ol-popup.css');
.ol-map,
#ol-map-container {
  position: absolute;
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
</style>
