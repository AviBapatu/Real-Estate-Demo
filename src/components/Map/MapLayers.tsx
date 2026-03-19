import React from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import type { FillLayerSpecification, LineLayerSpecification, RasterLayerSpecification, SymbolLayerSpecification } from 'maplibre-gl';

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
      'case',
      ['boolean', ['feature-state', 'isMatched'], true],
      [
        'match',
        ['get', 'status'],
        'sold', '#ef4444',
        '#22c55e', // default: available
      ],
      '#9ca3af', // Unmatched features become gray
    ],
    'fill-color-transition': { duration: 300 },
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false], 0.7,
      ['boolean', ['feature-state', 'isMatched'], true], 0.5,
      0.15, // faded out when unmatched
    ],
    'fill-opacity-transition': { duration: 300 },
  },
};

const plotsLineStyle: Omit<LineLayerSpecification, 'source'> = {
  id: 'plots-line-layer',
  type: 'line',
  paint: {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'isMatched'], true], '#ffffff',
      '#6b7280', // grey outline for unmatched
    ],
    'line-opacity': [
      'case',
      ['boolean', ['feature-state', 'isMatched'], true], 1.0,
      0.3, // Dim outline when unmatched
    ],
    'line-opacity-transition': { duration: 300 },
    'line-width': [
      'case',
      ['boolean', ['feature-state', 'hover'], false], 3,
      ['boolean', ['feature-state', 'isMatched'], true], 2,
      1,
    ],
  },
};

const plotsSymbolStyle: Omit<SymbolLayerSpecification, 'source'> = {
  id: 'plots-symbol-layer',
  type: 'symbol',
  layout: {
    'text-field': '{plotNumber}',
    'text-size': 16,
    'text-anchor': 'center',
    'text-allow-overlap': false,
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Regular']
  },
  paint: {
    'text-color': '#111827',
    'text-halo-color': '#ffffff',
    'text-halo-width': 2,
    'text-opacity': [
      'case',
      ['boolean', ['feature-state', 'isMatched'], true], 1.0,
      0.3
    ],
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
export const MapLayers = React.memo(({ imageBounds, baseMapUrl, plotData }: MapLayersProps) => {
  const enrichedPlotData = React.useMemo(() => {
    if (!plotData || !plotData.features) return plotData;
    return {
      ...plotData,
      features: plotData.features.map((f: any) => {
        const id = f.properties?.id || '';
        const parts = String(id).split('-');
        const plotNumber = parts.length > 0 ? parts[parts.length - 1] : id;
        
        return {
          ...f,
          properties: {
            ...f.properties,
            plotNumber: plotNumber
          }
        };
      })
    };
  }, [plotData]);

  return (
    <>
      {/* Base satellite/plan image */}
      <Source id="base-image-source" type="image" url={baseMapUrl} coordinates={imageBounds}>
        <Layer {...baseImageLayerStyle} />
      </Source>

      {/* Plot polygons — promoteId wires the JSON "id" field to WebGL feature state */}
      <Source id="plots-source" type="geojson" data={enrichedPlotData} promoteId="id">
        <Layer {...plotsFillStyle} />
        <Layer {...plotsLineStyle} />
        <Layer {...plotsSymbolStyle} />
      </Source>
    </>
  );
});

MapLayers.displayName = 'MapLayers';
