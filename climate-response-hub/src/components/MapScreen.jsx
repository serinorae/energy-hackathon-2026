import { useEffect, useRef } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Zoom from "@arcgis/core/widgets/Zoom";
import Point from "@arcgis/core/geometry/Point";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

const HEATWAVE_START = "2024-06-17";
const HEATWAVE_END = "2024-06-21";

async function getCurrentWatherRisk(lat, lng) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}` +
      `&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature` +
      `&timezone=America%2FToronto`;

    const response = await fetch(url);
    const data = await response.json();

    const feelsLike = data.current?.apparent_temperature;

    if (feelsLike >= 42) return 95;
    if (feelsLike >= 38) return 85;
    if (feelsLike >= 34) return 70;
    if (feelsLike >= 30) return 55;
    if (feelsLike >= 25) return 40;
    return 25;
  } catch (error) {
    console.error("Current weather API error:", error);
    return 50;
  }
}

async function getHeatWaveRisk(lat, lng) {
  try {
    const url =
      `https://archive-api.open-meteo.com/v1/archive` +
      `?latitude=${lat}` +
      `&longitude=${lng}` +
      `&start_date=${HEATWAVE_START}` +
      `&end_date=${HEATWAVE_END}` +
      `&hourly=apparent_temperature` +
      `&timezone=America%2FToronto`;

    const response = await fetch(url);
    const data = await response.json();

    const temps = data.hourly?.apparent_temperature || [];
    const validTemps = temps.filter((v) => v !== null && v !== undefined);
    const maxFeelsLike = Math.max(...validTemps);

    if (maxFeelsLike >= 42) return 95;
    if (maxFeelsLike >= 38) return 85;
    if (maxFeelsLike >= 34) return 70;
    if (maxFeelsLike >= 30) return 55;
    return 35;
  } catch (error) {
    console.error("Heatwave API error:", error);
    return 75;
  }
}

function getRiskLevel(riskScore) {
  if (riskScore >= 80) return "Critical";
  if (riskScore >= 60) return "High";
  if (riskScore >= 40) return "Moderate";
  return "Lower";
}

function createRiskRenderer(weatherRisk) {
  return {
    type: "class-breaks",
    valueExpression: `
      var code = Number($feature.AREA_S_CD);

      var weatherRisk = ${weatherRisk};
      var vulnerabilityRisk = 40 + ((code * 13) % 50);
      var shelterAccessRisk = 30 + ((code * 7) % 60);

      return Round(
        weatherRisk * 0.5 +
        vulnerabilityRisk * 0.3 +
        shelterAccessRisk * 0.2
      );
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
  };
}

function calculateFinalRisk(areaCode, weatherRisk) {
  const code = Number(areaCode);

  const vulnerabilityRisk = 40 + ((code * 13) % 50);
  const shelterAccessRisk = 30 + ((code * 7) % 60);

  const riskScore = Math.round(
    weatherRisk * 0.5 + vulnerabilityRisk * 0.3 + shelterAccessRisk * 0.2,
  );

  return {
    riskScore,
    level: getRiskLevel(riskScore),
    weatherRisk,
    vulnerabilityRisk,
    shelterAccessRisk,
  };
}

function emojiIcon(place) {
  const hasBackup = place.backupPower === true;
  const noBackup = place.backupPower === false;

  const backupColor = hasBackup ? "#16a34a" : noBackup ? "#dc2626" : "#6b7280";
  const backupText = hasBackup || noBackup ? "⚡" : "?";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56">
      <circle cx="24" cy="24" r="20" fill="#7c3aed" stroke="white" stroke-width="2"/>
      <text x="24" y="31" text-anchor="middle" font-size="21" font-family="Arial, sans-serif">🏢</text>

      <circle cx="39" cy="39" r="12" fill="${backupColor}" stroke="white" stroke-width="2"/>
      <text x="39" y="45" text-anchor="middle" font-size="13" font-family="Arial, sans-serif">${backupText}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getMarkerStyle(place) {
  if (place.backupPower === true) {
    return { color: "#16a34a", emoji: "⚡" };
  }

  if (place.backupPower === false) {
    return { color: "#dc2626", emoji: "⚡" };
  }

  if (place.backupPower === null || place.backupPower === undefined) {
    return { color: "#6b7280", emoji: "?" };
  }

  return { color: "#7c3aed", emoji: "🏢" };
}

function getCapacityColor(capacity) {
  if (capacity >= 80) return "#ef4444";
  if (capacity >= 60) return "#f97316";
  if (capacity >= 40) return "#eab308";
  return "#22c55e";
}

export default function MapScreen({ onAreaSelect }) {
  const mapDiv = useRef(null);
  const heatRiskRef = useRef(75);
  const coolingPlacesRef = useRef([]);

  useEffect(() => {
    const coolingLayer = new GraphicsLayer();
    const labelLayer = new GraphicsLayer();

    const neighbourhoodLayer = new GeoJSONLayer({
      url: "/toronto-neighbourhoods.geojson",
      opacity: 0.65,
      renderer: createRiskRenderer(75),
      popupTemplate: {
        title: "{AREA_NAME}",
        content:
          "Heat Vulnerability Index is calculated using historical heatwave data, neighbourhood vulnerability, and cooling centre access.",
      },
    });

    const map = new Map({
      basemap: "dark-gray",
      layers: [neighbourhoodLayer, coolingLayer, labelLayer],
    });

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [-79.3832, 43.6532],
      zoom: 10,

      // popup: {
      //   dockEnabled: false,
      //   actions: [],
      //   visibleElements: {
      //     actionBar: false,
      //   },
      // },
    });

    let zoomWatcher = null;

    const renderCoolingPlaces = () => {
      coolingLayer.removeAll();

      coolingPlacesRef.current.forEach((place, index) => {
        let showEvery = 1;

        if (view.zoom < 10.5) {
          showEvery = 5; // 처음 화면: 적게
        } else if (view.zoom < 11.5) {
          showEvery = 2; // 첫 번째 확대: 더 많이
        } else {
          showEvery = 1; // 두 번째 확대: 전부 표시
        }

        if (index % showEvery !== 0) {
          return;
        }

        coolingLayer.add(
          new Graphic({
            geometry: {
              type: "point",
              longitude: place.lng,
              latitude: place.lat,
            },
            symbol: {
              type: "picture-marker",
              url: emojiIcon(place),
              width: view.zoom < 11 ? "22px" : "25px",
              height: view.zoom < 11 ? "22px" : "25px",
            },
            attributes: place,
            popupTemplate: {
              title: place.name,
              content: `
                <div style="font-size: 13px; line-height: 1.45;">
                  <div style="margin-top: 12px;">
                    <b>Capacity:</b>
                    <span style="color: ${getCapacityColor(place.capacity)}; font-weight: 800;">
                      ${place.capacity}%
                    </span>

                    <div style="
                      width: 100%;
                      height: 8px;
                      background: #334155;
                      border-radius: 999px;
                      overflow: hidden;
                      margin-top: 5px;
                    ">
                      <div style="
                        width: ${place.capacity}%;
                        height: 100%;
                        background: ${getCapacityColor(place.capacity)};
                        border-radius: 999px;
                      "></div>
                    </div>
                  <div><b>Type:</b> ${place.type}</div>
                  <div><b>Address:</b> ${place.address}</div>
                  <div><b>Phone:</b> ${place.phone}</div>
                  <div><b>Hours:</b> ${place.hours}</div>
                  <div><b>Amenities:</b> ${place.amenities}</div>


                  </div>
                </div>
              `,
            },
          }),
        );
      });
    };

    view.when(async () => {
      view.ui.remove("zoom");
      view.map.basemap.referenceLayers.removeAll();

      const zoom = new Zoom({ view });
      view.ui.add(zoom, "bottom-right");

      //CRUD
      //getHeatWaveRisk -> getCurrentWatherRisk to see the current risk
      const weatherRisk = await getHeatWaveRisk(43.6532, -79.3832);
      heatRiskRef.current = weatherRisk;
      neighbourhoodLayer.renderer = createRiskRenderer(weatherRisk);

      zoomWatcher = view.watch("zoom", () => {
        renderCoolingPlaces();
      });
    });

    fetch("/air-conditioned-cool-spaces.geojson")
      .then((response) => response.json())
      .then((data) => {
        const allowedTypes = ["LIBRARY", "COMM_CNTR", "CVC_CNTR", "MALL"];

        const coolingPlaces = data.features
          .map((feature, index) => {
            const props = feature.properties;

            if (!allowedTypes.includes(props.locationCode)) {
              return null;
            }

            const coords = feature.geometry?.coordinates?.[0];

            if (!coords) {
              return null;
            }

            const [lng, lat] = coords;

            const capacity = 35 + ((Number(props._id) * 17) % 61);

            return {
              id: props._id,
              index,
              name: props.locationName,
              type: props.locationDesc,
              code: props.locationCode,
              address: props.address,
              phone: props.phone,
              hours: `${props.monOpen} - ${props.monClose}`,
              amenities: props.amenities,
              capacity,
              backupPower:
                Number(props._id) % 3 === 0
                  ? true
                  : Number(props._id) % 3 === 1
                    ? false
                    : null,
              lng,
              lat,
            };
          })
          .filter(Boolean);

        coolingPlacesRef.current = coolingPlaces;
        renderCoolingPlaces();
      })
      .catch((error) => {
        console.error("Failed to load cool spaces:", error);
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
      labelLayer.add(
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
        const areaGeometry = result.graphic.geometry;

        const riskData = calculateFinalRisk(
          attributes.AREA_S_CD,
          heatRiskRef.current,
        );

        const coolingPlacesInArea = coolingPlacesRef.current
          .filter((place) => {
            try {
              let point = new Point({
                longitude: place.lng,
                latitude: place.lat,
                spatialReference: { wkid: 4326 },
              });

              if (areaGeometry.spatialReference?.wkid !== 4326) {
                point = webMercatorUtils.geographicToWebMercator(point);
              }

              return geometryEngine.contains(areaGeometry, point);
            } catch {
              return false;
            }
          })
          .slice(0, 5);

        onAreaSelect({
          name: attributes.AREA_NAME,
          code: attributes.AREA_S_CD,
          riskScore: riskData.riskScore,
          level: riskData.level,
          weatherRisk: riskData.weatherRisk,
          vulnerabilityRisk: riskData.vulnerabilityRisk,
          shelterAccessRisk: riskData.shelterAccessRisk,
          coolingPlaces: coolingPlacesInArea,
          coolingPlaceCount: coolingPlacesInArea.length,
        });
      }
    });

    return () => {
      if (zoomWatcher) {
        zoomWatcher.remove();
      }

      view.destroy();
    };
  }, [onAreaSelect]);

  return <div ref={mapDiv} className="map-area" />;
}
