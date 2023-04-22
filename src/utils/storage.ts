/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-14 14:33:43
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-20 17:20:07
 * @FilePath: \ace-firefly\src\utils\storage.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import type { EStorageKey } from '@/types/enums'
import { consoleWarn } from './logger'

function getStorageData (key: EStorageKey, parse?: boolean): string | null
function getStorageData<T> (key: EStorageKey, parse?: boolean): T | null
function getStorageData (key: EStorageKey, parse?: boolean): any {
  const value = window.localStorage.getItem(key)
  if (parse && value) {
    try {
      const result = JSON.parse(value)
      return result
    } catch (e) {
      consoleWarn('appStorage.get failed, err:', e)
      return null
    }
  } else {
    return value
  }
}

function clearStorageData (key: EStorageKey | EStorageKey[]) {
  let keyList: EStorageKey[] = []
  if (Array.isArray(key)) {
    keyList = key
  } else {
    keyList = [key]
  }
  keyList.forEach(item => {
    window.localStorage.removeItem(item)
  })
}

const appStorage = {
  save (key: EStorageKey, value: string) {
    window.localStorage.setItem(key, value)
  },
  get: getStorageData,

  clear: clearStorageData,
}

export default appStorage
