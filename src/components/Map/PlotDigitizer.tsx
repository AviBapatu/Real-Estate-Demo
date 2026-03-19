/**
 * PlotDigitizer — Pure MapLibre custom polygon drawing tool.
 *
 * No external draw library needed. Uses MapLibre's own click events,
 * a live GeoJSON source, and a floating React toolbar rendered via a
 * MapLibre custom control mounted through a DOM portal.
 *
 * Workflow:
 *   1. Click "🔑 ADMIN LOGIN" in the Navbar.
 *   2. A floating toolbar appears in the top-right corner of the map.
 *   3. Click "✏️ Draw Polygon" and click on the map to place vertices.
 *      Double-click (or click the first point) to close the polygon.
 *   4. Open DevTools → Console to copy the pasted GeoJSON.
 *   5. Paste into the `features` array in `src/data/plots.json` and refresh.
 */

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { MapRef } from 'react-map-gl/maplibre';
import type maplibregl from 'maplibre-gl';
import { useMapStore } from '../../store/useMapStore';

// ─── Constants ───────────────────────────────────────────────────────────────

const PREVIEW_SOURCE = 'digitizer-preview';
const PREVIEW_FILL_LAYER = 'digitizer-preview-fill';
const PREVIEW_LINE_LAYER = 'digitizer-preview-line';
const PREVIEW_POINTS_LAYER = 'digitizer-preview-points';

const CLOSE_THRESHOLD_PX = 12; // pixels — how close to first vertex to auto-close

// ─── Types ───────────────────────────────────────────────────────────────────

type LngLat = [number, number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pixelDistance(
  map: maplibregl.Map,
  a: LngLat,
  b: LngLat,
): number {
  const pa = map.project(a as [number, number]);
  const pb = map.project(b as [number, number]);
  return Math.hypot(pa.x - pb.x, pa.y - pb.y);
}

function buildGeoJSON(ring: LngLat[]): GeoJSON.FeatureCollection {
  if (ring.length < 2) return { type: 'FeatureCollection', features: [] };
  const closed: LngLat[] = [...ring, ring[0]];
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [closed] },
        properties: {},
      },
      {
        type: 'Feature',
        geometry: { type: 'MultiPoint', coordinates: ring },
        properties: {},
      },
    ],
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface PlotDigitizerProps {
  mapRef: React.RefObject<MapRef | null>;
}

export const PlotDigitizer = ({ mapRef }: PlotDigitizerProps) => {
  const isAdminMode = useMapStore((s) => s.isAdminMode);
  const isDrawing = useRef(false);
  const ring = useRef<LngLat[]>([]);
  const toolbarContainerRef = useRef<HTMLDivElement | null>(null);

  // ── Source / layer lifecycle ────────────────────────────────────────────

  const addSourceAndLayers = useCallback((map: maplibregl.Map) => {
    if (map.getSource(PREVIEW_SOURCE)) return;

    map.addSource(PREVIEW_SOURCE, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });

    map.addLayer({
      id: PREVIEW_FILL_LAYER,
      type: 'fill',
      source: PREVIEW_SOURCE,
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'fill-color': '#f59e0b',
        'fill-opacity': 0.25,
      },
    });

    map.addLayer({
      id: PREVIEW_LINE_LAYER,
      type: 'line',
      source: PREVIEW_SOURCE,
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'line-color': '#f59e0b',
        'line-width': 2,
        'line-dasharray': [2, 2],
      },
    });

    map.addLayer({
      id: PREVIEW_POINTS_LAYER,
      type: 'circle',
      source: PREVIEW_SOURCE,
      filter: ['==', '$type', 'Point'],
      paint: {
        'circle-radius': 5,
        'circle-color': '#f59e0b',
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 2,
      },
    });
  }, []);

  const removeSourceAndLayers = useCallback((map: maplibregl.Map) => {
    [PREVIEW_POINTS_LAYER, PREVIEW_LINE_LAYER, PREVIEW_FILL_LAYER].forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
    });
    if (map.getSource(PREVIEW_SOURCE)) map.removeSource(PREVIEW_SOURCE);
  }, []);

  const updatePreview = useCallback((map: maplibregl.Map) => {
    const src = map.getSource(PREVIEW_SOURCE) as maplibregl.GeoJSONSource | undefined;
    if (!src) return;
    src.setData(buildGeoJSON(ring.current));
  }, []);

  // ── Drawing logic ───────────────────────────────────────────────────────

  const startDrawing = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    isDrawing.current = true;
    ring.current = [];
    map.getCanvas().style.cursor = 'crosshair';
    updatePreview(map);
  }, [mapRef, updatePreview]);

  const cancelDrawing = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    isDrawing.current = false;
    ring.current = [];
    map.getCanvas().style.cursor = '';
    const src = map.getSource(PREVIEW_SOURCE) as maplibregl.GeoJSONSource | undefined;
    src?.setData({ type: 'FeatureCollection', features: [] });
  }, [mapRef]);

  const finishPolygon = useCallback((map: maplibregl.Map) => {
    if (ring.current.length < 3) {
      alert('A polygon needs at least 3 points.');
      cancelDrawing();
      return;
    }

    const closed: LngLat[] = [...ring.current, ring.current[0]];
    const plotExport = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [closed] },
      properties: {
        id: 'NEW_PLOT_ID',
        status: 'available',
        price: 0,
        size: '0 sqft',
        features: [],
      },
    };

    console.group('📦 PlotDigitizer — New Plot Created');
    console.info('Paste the JSON below into the `features` array in src/data/plots.json:');
    console.log(JSON.stringify(plotExport, null, 2));
    console.groupEnd();

    cancelDrawing();
    map.getCanvas().style.cursor = '';
  }, [cancelDrawing]);

  // ── Map click handler ───────────────────────────────────────────────────

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !isAdminMode) return;

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawing.current) return;

      const { lng, lat } = e.lngLat;
      const pt: LngLat = [lng, lat];

      // Auto-close when clicking near the first vertex
      if (ring.current.length >= 3) {
        const dist = pixelDistance(map, pt, ring.current[0]);
        if (dist < CLOSE_THRESHOLD_PX) {
          finishPolygon(map);
          return;
        }
      }

      ring.current = [...ring.current, pt];
      updatePreview(map);
    };

    const handleDblClick = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      finishPolygon(map);
    };

    map.on('click', handleClick);
    map.on('dblclick', handleDblClick);
    return () => {
      map.off('click', handleClick);
      map.off('dblclick', handleDblClick);
    };
  }, [isAdminMode, mapRef, updatePreview, finishPolygon]);

  // ── Source / layer mount ────────────────────────────────────────────────

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (isAdminMode) {
      const setup = () => addSourceAndLayers(map);
      if (map.isStyleLoaded()) {
        setup();
      } else {
        map.once('load', setup);
      }
    } else {
      cancelDrawing();
      removeSourceAndLayers(map);
    }

    return () => {
      cancelDrawing();
      removeSourceAndLayers(map);
    };
  }, [isAdminMode, mapRef, addSourceAndLayers, removeSourceAndLayers, cancelDrawing]);

  // ── Toolbar DOM control ─────────────────────────────────────────────────

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (isAdminMode) {
      const container = document.createElement('div');
      container.className = 'digitizer-toolbar-mount';
      container.style.zIndex = '20';           // above navbar (z-index: 10)
      container.style.marginTop = '64px';      // clear the navbar height
      container.style.pointerEvents = 'auto';  // MapLibre ctrl wrapper has pointer-events:none — restore it
      toolbarContainerRef.current = container;

      // Create a MapLibre IControl wrapper to place the toolbar in the map UI
      const control: maplibregl.IControl = {
        onAdd: () => container,
        onRemove: () => container.remove(),
      };

      map.addControl(control, 'top-right');

      return () => {
        map.removeControl(control);
        toolbarContainerRef.current = null;
      };
    }
  }, [isAdminMode, mapRef]);

  // ── Render ──────────────────────────────────────────────────────────────

  if (!isAdminMode || !toolbarContainerRef.current) return null;

  return createPortal(
    <DigitizerToolbar
      onStartDraw={startDrawing}
      onCancel={cancelDrawing}
      isDrawingRef={isDrawing}
    />,
    toolbarContainerRef.current,
  );
};

// ─── Toolbar UI ───────────────────────────────────────────────────────────────

interface ToolbarProps {
  onStartDraw: () => void;
  onCancel: () => void;
  isDrawingRef: React.RefObject<boolean>;
}

const DigitizerToolbar = ({ onStartDraw, onCancel, isDrawingRef }: ToolbarProps) => {
  return (
    <div
      style={{
        margin: '10px',
        background: '#1e1e2e',
        border: '1px solid #374151',
        borderRadius: '8px',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        minWidth: '140px',
      }}
    >
      <div style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid #374151' }}>
        Plot Digitizer
      </div>
      <button
        onClick={onStartDraw}
        style={{
          padding: '6px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: 600,
          background: '#f59e0b',
          color: '#1c1c1c',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        ✏️ Draw Polygon
      </button>
      <button
        onClick={onCancel}
        style={{
          padding: '6px 10px',
          borderRadius: '5px',
          fontSize: '12px',
          fontWeight: 600,
          background: '#374151',
          color: '#e5e7eb',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        🗑️ Cancel / Clear
      </button>
      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
        {isDrawingRef.current
          ? 'Click to place vertices. Dbl-click or click first point to close.'
          : 'Click Draw to start placing vertices.'}
      </div>
    </div>
  );
};
