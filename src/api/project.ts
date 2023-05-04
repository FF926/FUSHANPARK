/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-22 14:57:01
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-05-04 09:32:16
 * @FilePath: \ace-firefly\src\api\project.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import request from '@/api/http/request'

export async function getWarnList(body: any) {
  const url = `/warn/getList`
  const result = await request.post(url, body)
  return result.data
}

/**
 * 更新预警状态
 * @param body 1|2|3 确认|误报|已处理
 * @returns
 */
export async function updateWarnStatus(body: { id: number; status: 1 | 2 | 3 }) {
  const url = `/warn/updateStatusById?id=${body.id}&status=${body.status}`
  const result = await request.post(url)
  return result.data
}

/**
 * 删除预警记录
 * @param body
 * @returns
 */
export async function deleteWarn(body: { id: number }) {
  const url = `/warn/delById?id=${body.id}`
  const result = await request.post(url)
  return result.data
}
