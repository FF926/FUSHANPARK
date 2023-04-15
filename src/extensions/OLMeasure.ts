/*
 * @Description:OL测量(长度|面积)工具类 搭配olStyle.scss使用
 * @Author: chongyanlin
 * @Date: 2021-12-23 11:39:23
 * @LastEditors: chongyanlin chongyanlin@aceimage.com
 */

import type VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import * as Style from "ol/style";
import type Map from "ol/Map";
import Overlay from "ol/Overlay";
import type { EventsKey } from "ol/events";
import Draw from "ol/interaction/Draw";
import { unByKey } from "ol/Observable";
import * as Geom from "ol/geom";
import { getArea, getLength } from "ol/sphere";

/**
 * 在地图中移除指定interactionName的交互
 * @param map Map对象
 * @param name 自定义的interactionName
 */
function removeInteractionByName(map: Map, name: string) {
  map.getInteractions().forEach((interaction) => {
    if (Object.keys(interaction.getProperties()).includes("interactionName")) {
      if (interaction.get("interactionName") === name) {
        map.removeInteraction(interaction);
      }
    }
  });
}

/**
 * 移除地图指定overlay
 * @param map Map对象
 * @param name overLayName
 * @returns overLayName绑定的节点
 */
function removeOverLayByName(map: Map, name: string) {
  const eles: HTMLElement[] = [];
  map.getOverlays().forEach((overLay) => {
    if (
      overLay &&
      Object.keys(overLay.getProperties()).includes("overLayName")
    ) {
      if (overLay.get("overLayName") === name) {
        eles.push(overLay.getElement()!);
        map.removeOverlay(overLay);
      }
    }
  });
  return eles;
}

const pointerStyle = new Style.Style({
  fill: new Style.Fill({
    color: "rgba(255, 255, 255, 0.7)",
  }),
  stroke: new Style.Stroke({
    color: "rgba(255, 200, 50, 1)",
    width: 2,
  }),
  image: new Style.Circle({
    radius: 7,
    fill: new Style.Fill({
      color: "rgba(255, 200, 50, 1)",
    }),
  }),
});

const drawStyle = new Style.Style({
  fill: new Style.Fill({
    color: "rgba(255, 255, 255, 0.2)",
  }),
  stroke: new Style.Stroke({
    color: "rgba(255, 0, 0, 0.8)",
    lineDash: [10, 10],
    width: 2,
  }),
  image: new Style.Circle({
    radius: 5,
    stroke: new Style.Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new Style.Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
  }),
});

export default class OLMeasure {
  private map: Map;
  private pointerStyle = pointerStyle;
  private drawStyle = drawStyle;
  private source: any;
  private interactionName = "measureDraw";
  private measureOverLayName = "measureOverLay";
  private measureTooltipElement: HTMLElement | null = null;
  private measureTooltip: Overlay | null = null;
  private helpTooltipElement: HTMLElement | null = null;
  private helpTooltip: Overlay | null = null;
  private pointerMoveEvent: EventsKey | null = null;
  private sketch: any = null;

  /**
   * setPointerStyle
   */
  public setPointerStyle(style: Style.Style) {
    this.pointerStyle = style;
  }

  /**
   * setDrawStyle
   */
  public setDrawStyle(style: Style.Style) {
    this.drawStyle = style;
  }

  /**
   * startMeasure
   */
  public startMeasure(type: "length" | "area") {
    this.addInteraction(type);

    if (this.pointerMoveEvent) {
      unByKey(this.pointerMoveEvent);
    }
    this.pointerMoveEvent = this.map.on("pointermove", (evt) => {
      if (evt.dragging) {
        return;
      }
      let helpMsg = "点击地图开始测量";

      const continuePolygonMsg = "双击完成面绘制";

      const continueLineMsg = "双击完成线绘制";

      if (this.sketch) {
        const geom = this.sketch.getGeometry();
        if (geom instanceof Geom.Polygon) {
          helpMsg = continuePolygonMsg;
        } else if (geom instanceof Geom.LineString) {
          helpMsg = continueLineMsg;
        }
      }

      this.helpTooltipElement!.innerHTML = helpMsg;
      this.helpTooltip!.setPosition(evt.coordinate);

      this.helpTooltipElement!.classList.remove("hidden");
    });
  }

  /**
   * closeMeasure
   */
  public closeMeasure() {
    this.source.clear();

    if (this.pointerMoveEvent) {
      unByKey(this.pointerMoveEvent);
      this.pointerMoveEvent = null;
    }
    removeInteractionByName(this.map, this.interactionName);

    removeOverLayByName(this.map, this.measureOverLayName);
    console.log("ol-tooltip removed");

    removeElementsByClass("ol-tooltip");
    this.measureTooltipElement = null;
    this.measureTooltip = null;

    this.helpTooltipElement = null;
    this.helpTooltip = null;
  }

  private formatLength(line: Geom.LineString) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  }

  private formatArea(polygon: Geom.Polygon) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output =
        Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  }

  private createHelpTooltip() {
    if (this.helpTooltipElement instanceof HTMLElement) {
      this.helpTooltipElement.parentNode!.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement("div");
    this.helpTooltipElement.className = "ol-tooltip hidden";
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    this.helpTooltip.set("overLayName", this.measureOverLayName);
    this.map.addOverlay(this.helpTooltip);
  }

  private createMeasureTooltip() {
    if (this.measureTooltipElement instanceof HTMLElement) {
      this.measureTooltipElement.parentNode!.removeChild(
        this.measureTooltipElement
      );
    }
    this.measureTooltipElement = document.createElement("div");
    this.measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
      stopEvent: false,
      insertFirst: false,
    });
    this.measureTooltip.set("overLayName", this.measureOverLayName);
    this.map.addOverlay(this.measureTooltip);
  }

  public addInteraction(type: "length" | "area") {
    removeInteractionByName(this.map, this.interactionName);

    // 添加draw交互
    const _type = type === "area" ? "Polygon" : "LineString";
    const draw = new Draw({
      source: this.source,
      type: _type,
      style: this.drawStyle,
    });
    draw.set("interactionName", this.interactionName);
    this.map.addInteraction(draw);

    this.createMeasureTooltip();
    this.createHelpTooltip();

    let listener: EventsKey;

    draw.on("drawstart", (evt) => {
      // set sketch
      this.sketch = evt.feature;

      let tooltipCoord = (evt as any).coordinate;

      listener = this.sketch.getGeometry()!.on("change", (evt: any) => {
        const geom = evt.target;
        let output;
        if (geom instanceof Geom.Polygon) {
          output = this.formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof Geom.LineString) {
          output = this.formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        (this.measureTooltipElement!.innerHTML as any) = output;
        this.measureTooltip!.setPosition(tooltipCoord);
      });
    });

    draw.on("drawend", () => {
      this.measureTooltipElement!.className = "ol-tooltip ol-tooltip-static";
      this.measureTooltip!.setOffset([0, -7]);
      // unset sketch
      this.sketch = null;
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null;
      this.createMeasureTooltip();
      unByKey(listener);
    });
  }

  constructor(map: Map, layer: VectorLayer<any>) {
    this.map = map;

    this.source = layer.getSource() || new VectorSource();

    layer.setStyle(this.pointerStyle);
  }
}

function removeElementsByClass(className: string) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode?.removeChild(elements[0]);
  }
}
