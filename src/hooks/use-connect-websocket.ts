/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-21 09:22:53
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-21 09:27:51
 * @FilePath: \ace-firefly\src\hooks\use-connect-websocket.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { onMounted, onUnmounted } from 'vue'
import ReconnectingWebSocket from 'reconnecting-websocket'
import ConnectWebSocket, { type MessageHandler } from '@/websocket'
import { getWebsocketUrl } from '@/websocket/util/config'

/**
 * 接收一个message函数
 * @param messageHandler
 */
export function useConnectWebSocket(messageHandler: MessageHandler) {
  const webSocket = new ConnectWebSocket(getWebsocketUrl())

  onMounted(() => {
    webSocket?.registerMessageHandler(messageHandler)
    webSocket?.initSocket()
  })

  onUnmounted(() => {
    webSocket?.close()
  })
}
