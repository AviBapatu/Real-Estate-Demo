import { useRef } from 'react';
import Map from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import { calculateImageBounds } from '../../utils/coordinateMath';
import { useMapEngine } from '../../hooks/useMapEngine';
import { useMapStore } from '../../store/useMapStore';
import { MapLayers } from './MapLayers';
import { PlotDigitizer } from './PlotDigitizer';
import plotData from '../../data/plots.json';
import baseMapUrl from '../../../public/assets/map/base-map.webp';

// ─── Module-level stable constants ────────────────────────────────────────────
// Nothing here changes after first parse, so MapLibre never sees new references.

const IMAGE_WIDTH = 4000;
const IMAGE_HEIGHT = 2250;
const imageBounds = calculateImageBounds(IMAGE_WIDTH, IMAGE_HEIGHT);

const STABLE_MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#ffffff' },
    },
  ],
};

const INITIAL_VIEW_STATE = {
  bounds: [
    [0, 0],
    [imageBounds[1][0], imageBounds[0][1]],
  ] as [[number, number], [number, number]],
  fitBoundsOptions: { padding: 50 },
};

const MAP_BOUNDS = [
  [-0.05, -0.05],
  [imageBounds[1][0] + 0.05, imageBounds[0][1] + 0.05],
] as [[number, number], [number, number]];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MapView — pure orchestrator.
 *
 * This component owns only:
 *   - The mapRef
 *   - The <Map> container and its static config
 *   - Wiring between useMapEngine handlers and the map events
 *
 * All search/hover/click logic → useMapEngine.ts
 * All WebGL layer definitions  → MapLayers.tsx
 */
export const MapView = () => {
  const mapRef = useRef<MapRef>(null);
  const { onMouseMove, onMouseLeave, handleMapClick } = useMapEngine(mapRef);
  const setAppLoading = useMapStore((state) => state.setAppLoading);

  return (
    <Map
      ref={mapRef}
      initialViewState={INITIAL_VIEW_STATE}
      mapStyle={STABLE_MAP_STYLE}
      style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}
      maxBounds={MAP_BOUNDS}
      minZoom={8}
      maxZoom={18}
      interactiveLayerIds={['plots-fill-layer']}
      onClick={handleMapClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      // Re-trigger feature state sync once the canvas + sources are ready
      onLoad={() => {
        useMapStore.setState({ searchQuery: '' });
        setTimeout(() => setAppLoading(false), 500);
      }}
    >
      <MapLayers
        imageBounds={imageBounds}
        baseMapUrl={baseMapUrl}
        plotData={plotData}
      />
      <PlotDigitizer mapRef={mapRef} />
    </Map>
  );
};