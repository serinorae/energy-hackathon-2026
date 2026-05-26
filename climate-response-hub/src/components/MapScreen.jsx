import { useEffect, useRef, useState } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Zoom from "@arcgis/core/widgets/Zoom";
import Point from "@arcgis/core/geometry/Point";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";

import RiskToggle from "./map/RiskToggle";
import { AREA_LABELS, TORONTO_LAT, TORONTO_LNG } from "./map/mapConfig";
import { createRiskRenderer } from "./map/riskRenderer";
import { emojiIcon, createCoolingPlacePopup } from "./map/markerUtils";
import { calculateFinalRisk } from "../utils/riskUtils";
import { loadCoolingPlaces } from "../utils/coolingPlaces";
import { getDemoWeatherRisk, getForecastRisk } from "../utils/weatherApi";

function createNeighbourhoodLayer() {
  return new GeoJSONLayer({
    url: "/toronto-neighbourhoods.geojson",
    opacity: 0.65,
    renderer: createRiskRenderer(75),
    popupTemplate: {
      title: "{AREA_NAME}",
      content:
        "Heat Vulnerability Index is calculated using weather data, neighbourhood vulnerability, and cooling centre access.",
    },
  });
}

function createMapView(mapDiv, map) {
  return new MapView({
    container: mapDiv.current,
    map,
    center: [TORONTO_LNG, TORONTO_LAT],
    zoom: 10,
    constraints: {
      minZoom: 9,
      maxZoom: 14,
      rotationEnabled: false,
      geometry: {
        type: "extent",
        xmin: -79.75,
        ymin: 43.55,
        xmax: -79.05,
        ymax: 43.9,
        spatialReference: { wkid: 4326 },
      },
    },
    popup: {
      dockEnabled: false,
      actions: [],
      visibleElements: { actionBar: false },
    },
  });
}

function addAreaLabels(labelLayer) {
  AREA_LABELS.forEach((label) => {
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
          font: { size: 13, weight: "bold" },
        },
      }),
    );
  });
}

function renderCoolingPlaces(view, coolingLayer, coolingPlaces) {
  coolingLayer.removeAll();

  coolingPlaces.forEach((place, index) => {
    let showEvery = 1;
    if (view.zoom < 10.5) showEvery = 5;
    else if (view.zoom < 11.5) showEvery = 2;

    if (index % showEvery !== 0) return;

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
          content: createCoolingPlacePopup(place),
        },
      }),
    );
  });
}

async function renderManagedDistricts(neighbourhoodLayer, managedLayer) {
  managedLayer.removeAll();
  await neighbourhoodLayer.when();

  const query = neighbourhoodLayer.createQuery();
  query.where = "1=1";
  query.outFields = ["AREA_S_CD", "AREA_NAME"];
  query.returnGeometry = true;

  const result = await neighbourhoodLayer.queryFeatures(query);

  result.features.forEach((feature) => {
    const code = feature.attributes.AREA_S_CD;
    const saved = localStorage.getItem(`managed-district-${code}`);
    if (!saved) return;

    managedLayer.add(
      new Graphic({
        geometry: feature.geometry,
        symbol: {
          type: "simple-fill",
          color: [34, 197, 94, 0.08],
          outline: { color: [34, 197, 94, 1], width: 3 },
        },
      }),
    );
  });
}

function getCoolingPlacesInArea(areaGeometry, coolingPlaces) {
  return coolingPlaces
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
}

export default function MapScreen({ onAreaSelect }) {
  const mapDiv = useRef(null);
  const heatRiskRef = useRef(75);
  const coolingPlacesRef = useRef([]);
  const neighbourhoodLayerRef = useRef(null);
  const applyRiskModeRef = useRef(null);
  const onAreaSelectRef = useRef(onAreaSelect);

  const [riskMode, setRiskMode] = useState(() => {
    return localStorage.getItem("risk-mode") || "current";
  });
  const initialRiskModeRef = useRef(
    localStorage.getItem("risk-mode") || "current",
  );

  useEffect(() => {
    onAreaSelectRef.current = onAreaSelect;
  }, [onAreaSelect]);

  useEffect(() => {
    const managedLayer = new GraphicsLayer();
    const coolingLayer = new GraphicsLayer();
    const labelLayer = new GraphicsLayer();
    const neighbourhoodLayer = createNeighbourhoodLayer();

    neighbourhoodLayerRef.current = neighbourhoodLayer;

    const map = new Map({
      basemap: "dark-gray",
      layers: [neighbourhoodLayer, managedLayer, coolingLayer, labelLayer],
    });

    const view = createMapView(mapDiv, map);
    let zoomWatcher = null;

    const applyRiskMode = async (mode) => {
      setRiskMode(mode);
      localStorage.setItem("risk-mode", mode);

      // Demo mode: current = normal weather, forecast = heatwave after 12 hours.
      // For real API mode, replace this line with getCurrentWeatherRisk/getForecastRisk.
      const weatherRisk = await getDemoWeatherRisk(mode);

      // const weatherRisk =
      //   mode === "current"
      //     ? await getCurrentWeatherRisk(TORONTO_LAT, TORONTO_LNG)
      //     : await getForecastRisk(TORONTO_LAT, TORONTO_LNG, 12);

      heatRiskRef.current = weatherRisk;
      neighbourhoodLayer.renderer = createRiskRenderer(weatherRisk);
    };

    applyRiskModeRef.current = applyRiskMode;

    view.when(async () => {
      view.ui.remove("zoom");
      view.map.basemap.referenceLayers.removeAll();
      view.ui.add(new Zoom({ view }), "bottom-right");

      await applyRiskMode(initialRiskModeRef.current);
      await renderManagedDistricts(neighbourhoodLayer, managedLayer);

      zoomWatcher = view.watch("zoom", () => {
        renderCoolingPlaces(view, coolingLayer, coolingPlacesRef.current);
      });
    });

    loadCoolingPlaces()
      .then((coolingPlaces) => {
        coolingPlacesRef.current = coolingPlaces;
        renderCoolingPlaces(view, coolingLayer, coolingPlaces);
      })
      .catch((error) => console.error("Failed to load cool spaces:", error));

    addAreaLabels(labelLayer);

    const handleManagedUpdate = () => {
      renderManagedDistricts(neighbourhoodLayer, managedLayer);
    };

    window.addEventListener("managed-district-updated", handleManagedUpdate);

    view.on("click", async (event) => {
      const response = await view.hitTest(event);
      const result = response.results.find(
        (result) => result.graphic?.layer === neighbourhoodLayer,
      );

      if (!result) return;

      const attributes = result.graphic.attributes;
      const areaGeometry = result.graphic.geometry;
      const riskData = calculateFinalRisk(
        attributes.AREA_S_CD,
        heatRiskRef.current,
      );
      const coolingPlacesInArea = getCoolingPlacesInArea(
        areaGeometry,
        coolingPlacesRef.current,
      );

      onAreaSelectRef.current({
        name: attributes.AREA_NAME,
        code: attributes.AREA_S_CD,
        riskScore: riskData.riskScore,
        level: riskData.level,
        weatherRisk: riskData.weatherRisk,
        vulnerabilityRisk: riskData.vulnerabilityRisk,
        shelterAccessRisk: riskData.shelterAccessRisk,
        coolingPlaces: coolingPlacesInArea,
        coolingPlaceCount: coolingPlacesInArea.length,
        riskMode,
      });
    });

    return () => {
      if (zoomWatcher) zoomWatcher.remove();
      window.removeEventListener(
        "managed-district-updated",
        handleManagedUpdate,
      );
      applyRiskModeRef.current = null;
      view.destroy();
    };
  }, []);

  return (
    <div className="map-wrapper">
      <RiskToggle
        riskMode={riskMode}
        onCurrentClick={() => applyRiskModeRef.current?.("current")}
        onForecastClick={() => applyRiskModeRef.current?.("forecast")}
      />
      <div ref={mapDiv} className="map-area" />
    </div>
  );
}
