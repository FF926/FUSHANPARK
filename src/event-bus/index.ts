/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-11 16:16:13
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-11 16:16:34
 * @FilePath: \ace-firefly\src\event-bus\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import mitt, { type Emitter } from 'mitt'

type Events = {
  deviceUpgrade: any // 设备升级
  deviceLogUploadProgress: any // 设备日志上传
  flightTaskWs: any // 机场任务消息
}

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
