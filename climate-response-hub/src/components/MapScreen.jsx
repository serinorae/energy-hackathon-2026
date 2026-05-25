import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

import coolingCenters from "../data/cooling-centers.json";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Zoom from "@arcgis/core/widgets/Zoom";

export default function MapScreen({ onAreaSelect }) {
  const mapDiv = useRef(null);

  useEffect(() => {
    const coolingLayer = new GraphicsLayer();
    const neighbourhoodLayer = new GeoJSONLayer({
      url: "/toronto-neighbourhoods.geojson",
      opacity: 0.65,
      renderer: {
        type: "class-breaks",
        valueExpression: `
    var code = Number($feature.AREA_S_CD);
    return (code * 7) % 100;
  `,
        classBreakInfos: [
          {
            minValue: 80,
            maxValue: 100,
            symbol: {
              type: "simple-fill",
              color: [239, 68, 68, 0.65],
              outline: { color: [255, 255, 255, 0.45], width: 0.7 },
            },
            label: "Critical",
          },
          {
            minValue: 60,
            maxValue: 79,
            symbol: {
              type: "simple-fill",
              color: [249, 115, 22, 0.6],
              outline: { color: [255, 255, 255, 0.4], width: 0.7 },
            },
            label: "High",
          },
          {
            minValue: 40,
            maxValue: 59,
            symbol: {
              type: "simple-fill",
              color: [234, 179, 8, 0.55],
              outline: { color: [255, 255, 255, 0.35], width: 0.7 },
            },
            label: "Moderate",
          },
          {
            minValue: 0,
            maxValue: 39,
            symbol: {
              type: "simple-fill",
              color: [34, 197, 94, 0.45],
              outline: { color: [255, 255, 255, 0.3], width: 0.7 },
            },
            label: "Lower",
          },
        ],
      },
      popupTemplate: {
        title: "{AREA_NAME}",
        content: "Estimated Heat Risk Score: {expression/riskScore}",
        expressionInfos: [
          {
            name: "riskScore",
            title: "Risk Score",
            expression: `
        var code = Number($feature.AREA_S_CD);
        return Round((code * 7) % 100);
      `,
          },
        ],
      },
    });

    const map = new Map({
      basemap: "dark-gray-vector",
      layers: [neighbourhoodLayer, coolingLayer],
    });

    const view = new MapView({
      container: mapDiv.current,
      map: map,
      center: [-79.3832, 43.6532], // Toronto
      zoom: 10,
    });

    view.when(() => {
      view.ui.remove("zoom");

      const zoom = new Zoom({
        view,
      });

      view.ui.add(zoom, "bottom-right");
    });

    coolingCenters.forEach((center) => {
      const point = {
        type: "point",
        longitude: center.lng,
        latitude: center.lat,
      };

      const markerSymbol = {
        type: "simple-marker",
        color: center.backupPower ? "#22c55e" : "#ef4444",
        size: 12,
        outline: {
          color: "white",
          width: 1,
        },
      };

      const popupTemplate = {
        title: center.name,
        content: `
          Capacity: ${center.capacity}%<br/>
          Backup Power: ${center.backupPower ? "Yes" : "No"}
        `,
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        attributes: center,
        popupTemplate,
      });

      coolingLayer.add(pointGraphic);
    });

    view.on("click", async (event) => {
      const response = await view.hitTest(event);

      const result = response.results.find(
        (result) => result.graphic?.layer === neighbourhoodLayer,
      );

      if (result) {
        const attributes = result.graphic.attributes;

        const code = Number(attributes.AREA_S_CD);
        const riskScore = Math.round((code * 7) % 100);

        onAreaSelect({
          name: attributes.AREA_NAME,
          code: attributes.AREA_S_CD,
          riskScore,
          level:
            riskScore >= 80
              ? "Critical"
              : riskScore >= 60
                ? "High"
                : riskScore >= 40
                  ? "Moderate"
                  : "Lower",
        });
      }
    });

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return <div ref={mapDiv} className="map-area" />;
}
