import React from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { FillLayerSpecification, LineLayerSpecification, RasterLayerSpecification } from 'maplibre-gl';

// ─── Layer style objects (stable references — defined outside component) ──────
// Keeping these here means they're frozen at module parse time. MapLibre will
// never see a new object reference, so it won't re-apply the style mid-render.

const baseImageLayerStyle: Omit<RasterLayerSpecification, 'source'> = {
  id: 'base-image-layer',
  type: 'raster',
  paint: { 'raster-opacity': 1, 'raster-fade-duration': 0 },
};

const plotsFillStyle: Omit<FillLayerSpecification, 'source'> = {
  id: 'plots-fill-layer',
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'status'],
      'sold', '#ef4444',
      '#22c55e', // default: available
    ],
    'fill-color-transition': { duration: 300 },
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false], 0.6,
      ['boolean', ['feature-state', 'isMatched'], true], 0.4,
      0.02, // faded out when unmatched
    ],
    'fill-opacity-transition': { duration: 300 },
  },
};

const plotsLineStyle: Omit<LineLayerSpecification, 'source'> = {
  id: 'plots-line-layer',
  type: 'line',
  paint: {
    'line-color': '#ffffff',
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'isMatched'], true], 1.0,
      0.1,
    ],
    'line-opacity-transition': { duration: 300 },
    'line-width': 2,
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface MapLayersProps {
  imageBounds: [[number, number], [number, number], [number, number], [number, number]];
  baseMapUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotData: any;
}

/**
 * Memoized declarative layer tree.
 *
 * Because this is wrapped in React.memo and its props are all stable references
 * (module-level constants), it will NEVER re-render when the parent (MapView)
 * re-renders due to state changes like search queries. This is the ultimate
 * guarantee against WebGL blink caused by Source remounts.
 */
export const MapLayers = React.memo(({ imageBounds, baseMapUrl, plotData }: MapLayersProps) => (
  <>
    {/* Base satellite/plan image */}
    <Source id="base-image-source" type="image" url={baseMapUrl} coordinates={imageBounds}>
      <Layer {...baseImageLayerStyle} />
    </Source>

    {/* Plot polygons — promoteId wires the JSON "id" field to WebGL feature state */}
    <Source id="plots-source" type="geojson" data={plotData} promoteId="id">
      <Layer {...plotsFillStyle} />
      <Layer {...plotsLineStyle} />
    </Source>
  </>
));

MapLayers.displayName = 'MapLayers';
