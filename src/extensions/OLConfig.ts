/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2022-11-24 09:59:39
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-14 16:32:46
 * @FilePath: \ace-firefly\src\extensions\OLConfig.ts
 * @Description:
 *
 * Copyright (c) 2022 by chongyanlin chongyanlin@aceimage.com, All Rights Reserved.
 */
import * as OL from './OLPrototypes'
export { OL as prototype }
// 个人的，以后换公司的
const tdtToken = '801160e0e4ef099e50879e3b4647ef3d'

// 所有基础图层类型
export type BaseLayerTypes = 'OSMLayer' | 'ESRIStreethBlue' | 'TDTStreet' | 'TDTImage' | ''
const baseLayers = {
  OSMLayer: () =>
    new OL.Layer.Tile({
      source: new OL.Source.OSM()
    }),
  ESRIStreethBlue: () =>
    new OL.Layer.Tile({
      source: new OL.Source.XYZ({
        url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
        crossOrigin: 'anonymous'
      })
    }),
  TDTMark: (proj: 'c' | 'w') =>
    // 天地图标注图层
    new OL.Layer.Tile({
      source: new OL.Source.XYZ({
        url: `http://t{0-4}.tianditu.com/DataServer?T=cva_${proj}&tk=${tdtToken}&x={x}&y={y}&l={z}`,
        crossOrigin: 'anonymous'
      })
    }),
  TDTStreet: (proj: 'c' | 'w') =>
    // 天地图街道
    new OL.Layer.Tile({
      source: new OL.Source.XYZ({
        url: `http://t{0-4}.tianditu.com/DataServer?T=vec_${proj}&tk=${tdtToken}&x={x}&y={y}&l={z}`,
        crossOrigin: 'anonymous'
      })
    }),
  TDTImage: (proj: 'c' | 'w') =>
    //卫星图像
    new OL.Layer.Tile({
      source: new OL.Source.XYZ({
        url: `http://t{0-4}.tianditu.com/DataServer?T=img_${proj}&tk=${tdtToken}&x={x}&y={y}&l={z}`,
        crossOrigin: 'anonymous'
      })
    })
}

/**
 * 获取基础图层
 * @param type BaseLayerTypes
 * @returns
 */
export function getOLBaseLayer(type: BaseLayerTypes, proj?: 'c' | 'w') {
  if (type === '') {
    return []
  }
  if (!proj) {
    proj = 'w'
  }
  const layer = baseLayers[type](proj)
  layer.set('type', 'base')
  layer.set('layerName', type)
  if (type.startsWith('TDT')) {
    // 天地图额外添加注记
    const markLayer = baseLayers['TDTMark'](proj)
    markLayer.set('type', 'base')
    markLayer.set('layerName', 'TDTMark')
    return [layer, markLayer]
  }
  return [layer]
}

/**
 * 获取wms图层的边界
 * @param source wms
 * @param crs srid
 * @returns
 */
export async function getWMSLayerBBox(source: OL.Source.TileWMS, crs: string) {
  let url = source.getUrls()![0] + '?'
  const urlparam = new URLSearchParams()
  const params: any = {
    service: 'wms',
    version: '1.3.0',
    request: 'GetCapabilities'
  }
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      urlparam.append(key, params[key])
    }
  }
  url += urlparam.toString()

  const layerName = (source.getParams().LAYERS as string).split(':')[1]

  const aim = (await getLayersFromCapabilities(url)).filter((item: any) => item.Name === layerName)

  if (aim.length === 0) {
    return
  }

  const ly = aim[0]
  // 一般情况下geoserver里配置了常用坐标参考
  const extents = ly.BoundingBox.filter((item: any) => item.crs === crs)

  if (extents.length > 0) {
    return extents[0].extent
  } else {
    // 假如没有，转换一下
    const bbox = ly.BoundingBox[0]
    return OL.Proj.transformExtent(bbox.extent, bbox.crs, crs)
  }
}

async function getLayersFromCapabilities(src: string) {
  const parser = new OL.format.WMSCapabilities()

  const response = await fetch(src)

  const text = await response.text()

  const parsed = await parser.read(text)

  const info = parsed.Capability

  return info.Layer.Layer
}

export const initMousePosition = (target: HTMLElement) =>
  new OL.Controls.MousePosition({
    coordinateFormat: OL.Coordinate.createStringXY(4), // 将坐标保留4位小数位，并转换为字符串
    projection: 'EPSG:4326', // 定义投影
    className: 'custom-mouse-position', // 控件的CSS类名
    target // 将控件渲染在该DOM元素中
  })
