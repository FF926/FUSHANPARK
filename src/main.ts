/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-10 16:52:33
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-14 10:35:23
 * @FilePath: \ace-firefly\src\main.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/styles/main.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
