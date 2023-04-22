/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2023-04-22 14:57:01
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-22 15:16:24
 * @FilePath: \ace-firefly\src\api\project.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import request from '@/api/http/request'

export async function getWarnList(body: { page: number; page_size: number }) {
  const url = `/warn/getList?page=${body.page}&page_size=${body.page_size}`
  const result = await request.get(url)
  return result.data
}
