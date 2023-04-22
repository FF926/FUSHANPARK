/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-10 16:52:33
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-21 11:58:47
 * @FilePath: \ace-firefly\src\main.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/dark/css-vars.scss'

import './assets/styles/main.css'
import './assets/styles/olStyle.scss'
import store, { storeKey } from './store'
import { antComponents } from './antd'
import { CommonComponents } from './use-common-components'
import { createInstance } from '@/root'

const app = createInstance(App)
app.use(CommonComponents)
app.use(antComponents)
app.use(store, storeKey)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  locale: zhCn
})

app.mount('#app')
