/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-10 16:52:33
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-13 10:00:37
 * @FilePath: \ace-firefly\src\main.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { createApp } from 'vue'
import App from './App.vue'

import './assets/styles/main.css'
import { antComponents } from './antd'
import { CommonComponents } from './use-common-components'
const app = createApp(App)
app.use(CommonComponents)
app.use(antComponents)
app.mount('#app')
