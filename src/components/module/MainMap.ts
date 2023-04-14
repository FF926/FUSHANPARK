/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2022-11-24 15:21:24
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 * @LastEditTime: 2023-04-14 10:24:54
 * @FilePath: \ace-firefly\src\components\module\MainMap.ts
 * @Description:
 *
 * Copyright (c) 2022 by chongyanlin chongyanlin@aceimage.com, All Rights Reserved.
 */
import * as OL from '@/extensions/OLConfig'

export default class MainMap {
  map: OL.prototype.Map.default
  center = OL.prototype.Proj.fromLonLat([120.4347, 36.0881], 'EPSG:3857')
  layers = () => {
    return this.map
      .getAllLayers()
      .filter((ly) => ly.get('type') && ly.get('type') !== 'base')
      .map((ly) => {
        return {
          show: ly.getVisible(),
          name: ly.get('layerName'),
          title: ly.get('layerTitle')
        }
      })
  }
  constructor(ele: string) {
    this.map = new OL.prototype.Map.default({
      layers: OL.getOLBaseLayer('TDTImage'),
      target: ele,
      view: new OL.prototype.View.default({
        center: this.center,
        zoom: 15,
        maxZoom: 18,
        minZoom: 6
      }),
      controls: OL.prototype.Controls.defaults({
        attribution: false,
        zoom: false,
        rotate: false
      })
    })

    this.map
      .getControls()
      .extend([OL.initMousePosition(document.getElementById('mouse-position') as HTMLElement)])
    ;(window as any).olmap = this.map
  }

  reset() {
    this.map.getView().animate({
      zoom: 10,
      duration: 600,
      center: this.center
    })
  }

  clearNonBase() {
    const lys = this.map.getAllLayers().filter((ly) => ly.get('type') && ly.get('type') !== 'base')
    for (let index = 0; index < lys.length; index++) {
      this.map.removeLayer(lys[index])
    }
  }

  changeLayerVisible(layer: any) {
    const temp = this.map
      .getAllLayers()
      .filter(
        (ly) => ly.get('type') && ly.get('type') !== 'base' && ly.get('layerName') === layer.name
      )
    if (temp) {
      temp[0].setVisible(!temp[0].getVisible())
    }
  }

  /**
   * getMapLayerByName
   */
  public getMapLayerByName(name: string) {
    const temp = this.map
      .getLayers()
      .getArray()
      .filter((ly) => ly.get('layerName') === name)
    return temp[0] || null
  }

  /**
   * 给指定图层添加点击事件
   * @param layerName 图层名
   * @param cb 回调函数
   * @param onFalse 点击无效地区的回调函数
   * @returns EventsKey 事件回执，用Observable.unByKey取消关联
   */

  public addClickListenerToLayer(
    layerName: string,
    cb: (param: {
      features: OL.prototype.Feature.default[]
      event: OL.prototype.ol.MapBrowserEvent<any>
    }) => void,
    onFalse?: () => void
  ) {
    function falseBack(features: any, evt: any) {
      if (features.length > 0) {
        cb({
          event: evt,
          features
        })
      } else if (onFalse) {
        onFalse()
      }
    }
    const clickEvent = this.map.on('click', (evt) => {
      const aimLayer = this.getMapLayerByName(layerName) as any
      const source = aimLayer.getSource()

      if (source instanceof OL.prototype.Source.TileWMS) {
        const viewResolution = this.map.getView().getResolution() as number
        const url = source.getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          this.map.getView().getProjection(),
          { INFO_FORMAT: 'application/json' }
        )
        if (url) {
          fetch(url)
            .then((response) => response.text())
            .then((json) => {
              const features = OL.prototype.format.GeoJSON.prototype.readFeatures(json)
              falseBack(features, evt)
            })
        }
      } else if (source instanceof OL.prototype.Source.Vector) {
        const features = this.map.getFeaturesAtPixel(evt.pixel, {
          layerFilter: (layer) => layer.get('layerName') && layer.get('layerName') === layerName
        })

        falseBack(features, evt)
      } else {
        throw '不支持的图层类型'
      }
    })
    return clickEvent
  }

  // 获取矢量图层
  public getTempVecLayer(name: string) {
    const tempLayer = this.map
      .getLayers()
      .getArray()
      .filter((layer: any) => layer.get('type') === 'temp' && layer.get('layerName') === name)
    if (tempLayer.length > 0) {
      return tempLayer
    } else {
      return []
    }
  }

  // 增加临时空白矢量图层
  public addTempVecLayer(name: string, opt?: any) {
    const tempLayer = this.getTempVecLayer(name)
    // 若之前存在，移除
    if (tempLayer.length > 0) {
      tempLayer.forEach((item) => {
        this.map.removeLayer(item)
      })
    }
    //创建一个图层
    const vector = new OL.prototype.Layer.Vector(opt)
    vector.set('layerName', name)
    vector.set('type', 'temp')
    // 添加空source
    vector.setSource(new OL.prototype.Source.Vector())
    this.map.addLayer(vector)
    return vector
  }

  /**
   * reorderLayerToTop
   */
  public reorderLayerToTop(name: string) {
    const layer = this.getMapLayerByName(name)
    if (layer) {
      const num = this.map.getLayers().getLength()
      layer.setZIndex(num)
    }
  }
}

export function jsonToTable(json: any) {
  const table = document.createElement('table')
  json = json[0]
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const row = table.insertRow()
      const cellKey = row.insertCell()
      cellKey.textContent = key
      const cellVal = row.insertCell()
      cellVal.textContent = json[key]
    }
  }
  return table
}

export function parseProp(features: any) {
  return features.map((f: any) => {
    const prop = f.getProperties()
    delete prop.geometry
    return prop
  })
}
