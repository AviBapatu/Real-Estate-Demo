import { useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { calculateImageBounds } from '../../utils/coordinateMath';
import plotData from '../../data/plots.json'; 
import baseMap from "../../../public/assets/map/base-map.jpg"
import { useMapStore } from '../../store/useMapStore';

const IMAGE_WIDTH = 4000; 
const IMAGE_HEIGHT = 2250; 
const imageBounds = calculateImageBounds(IMAGE_WIDTH, IMAGE_HEIGHT);

export const MapView = () => {
  const mapRef = useRef<MapRef>(null);
  const hoveredPolygonId = useRef<string | null>(null);
  
  const setActivePlot = useMapStore((state) => state.setActivePlot);

  // 1. Handle Mouse Enter/Move
  const onMouseMove = (e: MapLayerMouseEvent) => {
    if (e.features && e.features.length > 0) {
      const map = mapRef.current?.getMap();
      if (!map) return;

      const currentHoverId = hoveredPolygonId.current;
      const newHoverId = e.features[0].properties?.id;

      // If we are hovering over a new polygon, turn off the old one
      if (currentHoverId && currentHoverId !== newHoverId) {
        map.setFeatureState(
          { source: 'plots-source', id: currentHoverId },
          { hover: false }
        );
      }

      // If the new feature has a valid ID, turn it on
      if (newHoverId) {
        hoveredPolygonId.current = newHoverId;
        map.setFeatureState(
          { source: 'plots-source', id: newHoverId },
          { hover: true }
        );
        map.getCanvas().style.cursor = 'pointer';
      }
    }
  };

  // 2. Handle Mouse Leave
  const onMouseLeave = () => {
    const map = mapRef.current?.getMap();
    const currentHoverId = hoveredPolygonId.current;

    // Safely use the narrowed local constant
    if (map && currentHoverId) {
      map.setFeatureState(
        { source: 'plots-source', id: currentHoverId },
        { hover: false }
      );
    }
    
    hoveredPolygonId.current = null;
    if (map) map.getCanvas().style.cursor = '';
  };

  const onClick = (e: MapLayerMouseEvent) => {
    // 1. Check if a polygon was clicked
    if (e.features && e.features.length > 0) {
      const clickedPlotId = e.features[0].properties?.id;
      if (clickedPlotId) {
        setActivePlot(clickedPlotId);
        console.log("State Updated: Active Plot is", clickedPlotId);
        // We will trigger the 360 viewer open state here later
      }
      return; // Exit early so we don't log coordinates
    }

    // 2. If no polygon was clicked, clear the state and log the coordinates
    setActivePlot(null);
    console.log(`[${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}],`);
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        bounds: [
          [0, 0],
          [imageBounds[1][0], imageBounds[0][1]]
        ],
        fitBoundsOptions: { padding: 50 }
      }}
      mapStyle={{ version: 8, sources: {}, layers: [] }}
      style={{ width: '100%', height: '100%' }}
      maxBounds={[
        [-0.05, -0.05],
        [imageBounds[1][0] + 0.05, imageBounds[0][1] + 0.05]
      ]}
      minZoom={8}
      maxZoom={18}
      onClick={onClick}
      interactiveLayerIds={['plots-fill-layer']}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Source
        id="base-image-source"
        type="image"
        url={baseMap}
        coordinates={imageBounds}
      >
        <Layer
          id="base-image-layer"
          type="raster"
          paint={{ 'raster-opacity': 1, 'raster-fade-duration': 0 }}
        />
      </Source>

      {/* Notice promoteId: This tells MapLibre to use your JSON's "id" property as the internal WebGL ID */}
      <Source id="plots-source" type="geojson" data={plotData as any} promoteId="id">
        <Layer 
          id="plots-fill-layer" 
          type="fill" 
          paint={{
            'fill-color': '#00ff00',
            // WebGL conditional logic: If feature-state 'hover' is true, opacity is 0.6, else 0.2
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.6, 
              0.2  
            ]
          }} 
        />
        <Layer 
          id="plots-line-layer" 
          type="line" 
          paint={{
            'line-color': '#ffffff',
            'line-width': 2
          }} 
        />
      </Source>
    </Map>
  );
};