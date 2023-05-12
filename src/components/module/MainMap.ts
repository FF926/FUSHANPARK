/*
 * @Author: chongyanlin chongyanlin@aceimage.com
 * @Date: 2022-11-24 15:21:24
 * @LastEditors: QingHe meet_fqh@163.com
 * @LastEditTime: 2023-05-12 08:40:32
 * @FilePath: \ace-firefly\src\components\module\MainMap.ts
 * @Description:
 *
 * Copyright (c) 2022 by chongyanlin chongyanlin@aceimage.com, All Rights Reserved.
 */
import * as OL from '@/extensions/OLConfig'
import Feature from 'ol/Feature.js'
import { Icon, Style } from 'ol/style'
export default class MainMap {
  ready: boolean = false
  map: OL.prototype.Map.default
  center = OL.prototype.Proj.fromLonLat([120.4347, 36.0881], 'EPSG:3857')

  baseLayer: OL.BaseLayerTypes = 'TDTImage'

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
      layers: OL.getOLBaseLayer(this.baseLayer),
      target: ele,
      view: new OL.prototype.View.default({
        center: this.center,
        projection: 'EPSG:3857',
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
    this.ready = true
  }

  /**
   * 替换基础底图
   */
  public switchBaseLayer() {
    const inLayer = this.baseLayer === 'TDTImage' ? 'TDTStreet' : 'TDTImage'

    const baseLayer = this.map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get('type') === 'base')
    baseLayer.forEach((layer) => {
      this.map.removeLayer(layer)
    })

    const inBase = OL.getOLBaseLayer(inLayer)
    inBase.forEach((layer, idx) => {
      this.map.getLayers().insertAt(idx, layer)
    })
    this.baseLayer = inLayer
  }

  reset() {
    this.map.getView().animate({
      zoom: 15,
      duration: 600,
      center: this.center
    })
  }
  setCenter(position: any) {
    position = OL.prototype.Proj.fromLonLat(position, 'EPSG:3857')
    console.log(position)

    this.map.getView().animate({
      zoom: 15,
      duration: 600,
      center: position
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
  public getTempVecLayer(name: string): OL.prototype.Layer.Vector<OL.prototype.Source.Vector>[] {
    const tempLayer = this.map
      .getLayers()
      .getArray()
      .filter((layer: any) => layer.get('type') === 'temp' && layer.get('layerName') === name)
    if (tempLayer.length > 0) {
      return tempLayer as any
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

  /**
   * addPhotoPin
   */
  public addPhotoPin(coord: any[]) {
    const ly = this.getTempVecLayer('photoLayer')
    ly[0].getSource()?.clear()

    const style = new Style({
      image: new Icon({
        src: 'src/assets/icons/fire.png',
        scale: 0.2
      })
    })
    const fireStyle = new Style({
      image: new Icon({
        src: 'src/assets/icons/fire.png',
        scale: 0.2
      })
    })
    const processedStyle = new Style({
      image: new Icon({
        src: 'src/assets/icons/processed.png',
        scale: 0.2
      })
    })
    const falseAlarmStyle = new Style({
      image: new Icon({
        src: 'src/assets/icons/falseAlarm.png',
        scale: 0.2
      })
    })
    coord.forEach((item: any) => {
      console.log('item', item)

      if (item.lon) {
        item.longitude = item.lon
        item.latitude = item.lat
      }
      const geometry = new OL.prototype.Geom.Point(
        OL.prototype.Proj.fromLonLat([item.longitude, item.latitude], 'EPSG:3857')
      )

      const f = new Feature({
        geometry
      })
      f.setId(item.id)
      f.setProperties({ ...item })
      switch (item.status) {
        case 0:
          f.setStyle(fireStyle)
          break
        case 1:
          f.setStyle(falseAlarmStyle)
          break
        case 2:
          f.setStyle(processedStyle)
          break
        default:
          f.setId(Number(item.lat))
          f.setStyle(style)
          break
      }

      ly[0].getSource()?.addFeature(f)

      return f
    })
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
