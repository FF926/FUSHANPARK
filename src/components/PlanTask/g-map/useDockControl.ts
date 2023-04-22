/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-21 11:02:48
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-21 11:11:10
 * @FilePath: \ace-firefly\src\components\PlanTask\g-map\useDockControl.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { postSendCmd } from '@/api/device-cmd'
import { DeviceCmd, type DeviceCmdItemAction } from '@/types/device-cmd'

export function useDockControl() {
  const controlPanelVisible = ref(false)

  function setControlPanelVisible(visible: boolean) {
    controlPanelVisible.value = visible
  }

  // 远程调试开关
  async function dockDebugOnOff(sn: string, on: boolean) {
    const result = await sendDockControlCmd(
      {
        sn: sn,
        cmd: on ? DeviceCmd.DebugModeOpen : DeviceCmd.DebugModeClose
      },
      false
    )
    if (result) {
      setControlPanelVisible(on)
    }
    return result
  }

  // 发送指令
  async function sendDockControlCmd(
    params: {
      sn: string
      cmd: DeviceCmd
      action?: DeviceCmdItemAction
    },
    tip = true
  ) {
    try {
      let body = undefined as any
      if (params.action !== undefined) {
        body = {
          action: params.action
        }
      }
      const { code, message: msg } = await postSendCmd(
        { dock_sn: params.sn, device_cmd: params.cmd },
        body
      )
      if (code === 0) {
        tip && message.success('指令发送成功')
        return true
      }
      throw msg
    } catch (e) {
      tip && message.error('指令发送失败')
      return false
    }
  }

  return {
    controlPanelVisible,
    setControlPanelVisible,
    sendDockControlCmd,
    dockDebugOnOff
  }
}
