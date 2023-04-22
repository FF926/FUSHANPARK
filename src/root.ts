/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-14 14:14:11
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-22 17:04:25
 * @FilePath: \ace-firefly\src\root.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import type { ComponentCustomProperties, App as VueApp } from 'vue'
import { createApp } from 'vue'
import MainMap from './components/module/MainMap'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $aMap: any // Map类
    $map: any // 地图对象
    $mouseTool: any
  }
}
let root: ComponentCustomProperties
let app = null as any

export function createInstance(App: any): VueApp {
  app = createApp(App)
  root = app.config.globalProperties as ComponentCustomProperties
  return app
}

export function getRoot(): ComponentCustomProperties {
  console.log(222)
  console.log(root)

  return root
}

export function getApp(): VueApp {
  return app
}

interface IProjectGlobal {
  $map: MainMap | null
}

export const project_global: IProjectGlobal = {
  $map: null
}
