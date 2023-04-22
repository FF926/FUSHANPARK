/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-21 09:27:00
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-21 10:09:57
 * @FilePath: \ace-firefly\src\websocket\util\config.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { ELocalStorageKey } from '@/types/enums'
import { CURRENT_CONFIG } from '@/api/http/config'

export function getWebsocketUrl() {
  const token: string = localStorage.getItem(ELocalStorageKey.Token) || ('' as string)
  const url = CURRENT_CONFIG.websocketURL + '?x-auth-token=' + encodeURI(token)
  return url
}
