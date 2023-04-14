/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-13 17:07:11
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-13 17:07:26
 * @FilePath: \ace-firefly\src\components\PlanTask\use-task-ws-event.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import EventBus from '@/event-bus/'
import { onMounted, onBeforeUnmount } from 'vue'
import type { TaskProgressInfo, MediaStatusProgressInfo, TaskMediaHighestPriorityProgressInfo } from '@/types/task'
import { EBizCode } from '@/types'

export interface UseTaskWsEventParams {
  onTaskProgressWs: (data: TaskProgressInfo) => void,
  onTaskMediaProgressWs: (data: MediaStatusProgressInfo) => void
  onoTaskMediaHighestPriorityWS: (data: TaskMediaHighestPriorityProgressInfo) => void
}

export function useTaskWsEvent (funcs: UseTaskWsEventParams): void {
  function handleTaskWsEvent (payload: any) {
    if (!payload) {
      return
    }

    switch (payload.biz_code) {
      case EBizCode.FlightTaskProgress: {
        funcs?.onTaskProgressWs(payload.data)
        break
      }
      case EBizCode.FlightTaskMediaProgress: {
        funcs?.onTaskMediaProgressWs(payload.data)
        break
      }
      case EBizCode.FlightTaskMediaHighestPriority: {
        funcs?.onoTaskMediaHighestPriorityWS(payload.data)
        break
      }
    }
    // eslint-disable-next-line no-unused-expressions
    // console.log('payload', payload.data)
  }

  onMounted(() => {
    EventBus.on('flightTaskWs', handleTaskWsEvent)
  })

  onBeforeUnmount(() => {
    EventBus.off('flightTaskWs', handleTaskWsEvent)
  })
}
