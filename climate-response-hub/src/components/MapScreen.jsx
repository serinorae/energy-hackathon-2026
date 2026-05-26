import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Zoom from "@arcgis/core/widgets/Zoom";

import coolingCenters from "../data/cooling-centers.json";

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
      basemap: "dark-gray",
      layers: [neighbourhoodLayer, coolingLayer],
    });

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-79.3832, 43.6532],
      zoom: 10,
    });

    view.when(() => {
      view.ui.remove("zoom");
      view.map.basemap.referenceLayers.removeAll();

      const zoom = new Zoom({ view });
      view.ui.add(zoom, "bottom-right");
    });

    const emojiIcon = (emoji, bgColor) => {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
          <circle cx="24" cy="24" r="22" fill="${bgColor}" stroke="white" stroke-width="3"/>
          <text x="24" y="31" text-anchor="middle" font-size="22" font-family="Arial, sans-serif">${emoji}</text>
        </svg>
      `;

      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

    coolingCenters.forEach((center) => {
      const basePoint = {
        type: "point",
        longitude: center.lng,
        latitude: center.lat,
      };

      const status = center.backupPower;

      let markerColor = "#7c3aed";
      let markerEmoji = "🏢";
      let markerTitle = "Cooling Centre";

      if (status === true) {
        markerColor = "#16a34a";
        markerEmoji = "⚡";
        markerTitle = "Has Backup Power";
      } else if (status === false) {
        markerColor = "#dc2626";
        markerEmoji = "⚡";
        markerTitle = "No Backup Power";
      } else if (status === null || status === undefined) {
        markerColor = "#6b7280";
        markerEmoji = "?";
        markerTitle = "Unknown Backup Power";
      }

      coolingLayer.add(
        new Graphic({
          geometry: basePoint,
          symbol: {
            type: "picture-marker",
            url: emojiIcon(markerEmoji, markerColor),
            width: "26px",
            height: "26px",
          },
          attributes: center,
          popupTemplate: {
            title: center.name,
            content: `
              Type: ${markerTitle}<br/>
              Capacity: ${center.capacity}%<br/>
              Backup Power: ${
                center.backupPower === true
                  ? "Yes"
                  : center.backupPower === false
                    ? "No"
                    : "Unknown"
              }
            `,
          },
        }),
      );
    });

    const areaLabels = [
      { name: "North\nYork", lng: -79.41, lat: 43.75 },
      { name: "Scarborough", lng: -79.25, lat: 43.76 },
      { name: "Etobicoke", lng: -79.55, lat: 43.66 },
      { name: "Downtown\nToronto", lng: -79.38, lat: 43.66 },
      { name: "East\nYork", lng: -79.33, lat: 43.7 },
      { name: "West\nToronto", lng: -79.45, lat: 43.67 },
    ];

    areaLabels.forEach((label) => {
      coolingLayer.add(
        new Graphic({
          geometry: {
            type: "point",
            longitude: label.lng,
            latitude: label.lat,
          },
          symbol: {
            type: "text",
            text: label.name,
            color: "white",
            haloColor: "black",
            haloSize: 1.5,
            font: {
              size: 13,
              weight: "bold",
            },
          },
        }),
      );
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
      view.destroy();
    };
  }, [onAreaSelect]);

  return <div ref={mapDiv} className="map-area" />;
}
