/*
 * @Author: QingHe meet_fqh@163.com
 * @Date: 2023-04-14 14:33:43
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-04-20 17:24:44
 * @FilePath: \ace-firefly\src\constants\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { CURRENT_CONFIG } from '@/api/http/config'

export const AMapConfig = {
  key: CURRENT_CONFIG.amapKey,
  version: '2.0',
  plugins: [
    'AMap.Scale',
    'AMap.ToolBar',
    'AMap.ControlBar',
    'AMap.ElasticMarker',
    'AMap.MapType',
    'AMap.Geocoder',
    'AMap.CircleEditor',
    'AMap.PolygonEditor',
    'AMap.PolylineEditor',
    'AMap.PolyEditor',
    'AMap.RangingTool',
    'AMap.Weather',
    'AMap.MouseTool',
    'AMap.MoveAnimation'
  ]
}
