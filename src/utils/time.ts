/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-14 14:33:43
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-20 17:20:19
 * @FilePath: \ace-firefly\src\utils\time.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { DATE_FORMAT, DEFAULT_PLACEHOLDER } from '@/utils/constants'
import moment from 'moment'
import type{ Moment } from 'moment'

// 时间字符串 或者 Unix 时间戳（毫秒数）
export function formatDateTime(time: string | number, format = DATE_FORMAT) {
  return time ? moment(time, format) : DEFAULT_PLACEHOLDER
}

// Unix 时间戳 (秒)
export function formatUnixTime(time: number, format = DATE_FORMAT): string {
  return time ? moment.unix(time).format(format) : DEFAULT_PLACEHOLDER
}
