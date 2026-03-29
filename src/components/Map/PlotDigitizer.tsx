/**
 * PlotDigitizer — Pure MapLibre custom polygon drawing tool.
 *
 * Fixes applied:
 *   - Cursor: a persistent mousemove handler forces 'crosshair' while drawing,
 *     overriding MapLibre's interactiveLayerIds cursor logic.
 *   - Dots: the points layer visibility is toggled via setLayoutProperty so
 *     vertex circles never show outside an active drawing session.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MapRef } from 'react-map-gl/maplibre';
import type maplibregl from 'maplibre-gl';
import { useMapStore } from '../../store/useMapStore';

// ─── Constants ───────────────────────────────────────────────────────────────

const PREVIEW_SOURCE       = 'digitizer-preview';
const PREVIEW_FILL_LAYER   = 'digitizer-preview-fill';
const PREVIEW_LINE_LAYER   = 'digitizer-preview-line';
const PREVIEW_POINTS_LAYER = 'digitizer-preview-points';
const CLOSE_THRESHOLD_PX   = 12;

type LngLat = [number, number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pixelDistance(map: maplibregl.Map, a: LngLat, b: LngLat): number {
  const pa = map.project(a as [number, number]);
  const pb = map.project(b as [number, number]);
  return Math.hypot(pa.x - pb.x, pa.y - pb.y);
}

const EMPTY_FC: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

function buildGeoJSON(ring: LngLat[]): GeoJSON.FeatureCollection {
  if (ring.length < 2) return EMPTY_FC;
  const closed: LngLat[] = [...ring, ring[0]];
  return {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [closed] }, properties: {} },
      { type: 'Feature', geometry: { type: 'MultiPoint', coordinates: ring }, properties: {} },
    ],
  };
}

function setDotsVisibility(map: maplibregl.Map, visible: boolean) {
  try {
    if (map.getLayer(PREVIEW_POINTS_LAYER)) {
      map.setLayoutProperty(PREVIEW_POINTS_LAYER, 'visibility', visible ? 'visible' : 'none');
    }
  } catch (e) {
    // Map style already removed, ignore
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface PlotDigitizerProps {
  mapRef: React.RefObject<MapRef | null>;
}

export const PlotDigitizer = ({ mapRef }: PlotDigitizerProps) => {
  const isAdminMode = useMapStore((s) => s.isAdminMode);

  // Use React state for isDrawing so the toolbar re-renders its hint text.
  const [isDrawing, setIsDrawing] = useState(false);

  const ring = useRef<LngLat[]>([]);
  const toolbarContainerRef = useRef<HTMLDivElement | null>(null);

  // ── Source / layer lifecycle ────────────────────────────────────────────

  const addSourceAndLayers = useCallback((map: maplibregl.Map) => {
    if (map.getSource(PREVIEW_SOURCE)) return;

    map.addSource(PREVIEW_SOURCE, { type: 'geojson', data: EMPTY_FC });

    map.addLayer({
      id: PREVIEW_FILL_LAYER,
      type: 'fill',
      source: PREVIEW_SOURCE,
      filter: ['==', '$type', 'Polygon'],
      paint: { 'fill-color': '#f59e0b', 'fill-opacity': 0.25 },
    });

    map.addLayer({
      id: PREVIEW_LINE_LAYER,
      type: 'line',
      source: PREVIEW_SOURCE,
      filter: ['==', '$type', 'Polygon'],
      paint: { 'line-color': '#f59e0b', 'line-width': 2, 'line-dasharray': [2, 2] },
    });

    map.addLayer({
      id: PREVIEW_POINTS_LAYER,
      type: 'circle',
      source: PREVIEW_SOURCE,
      filter: ['==', '$type', 'Point'],
      layout: { visibility: 'none' }, // hidden by default — only shown while drawing
      paint: {
        'circle-radius': 5,
        'circle-color': '#f59e0b',
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 2,
      },
    });
  }, []);

  const removeSourceAndLayers = useCallback((map: maplibregl.Map) => {
    try {
      [PREVIEW_POINTS_LAYER, PREVIEW_LINE_LAYER, PREVIEW_FILL_LAYER].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      if (map.getSource(PREVIEW_SOURCE)) map.removeSource(PREVIEW_SOURCE);
    } catch (e) {
      // Map style already removed during unmount
    }
  }, []);

  const updatePreview = useCallback((map: maplibregl.Map) => {
    try {
      const src = map.getSource(PREVIEW_SOURCE) as maplibregl.GeoJSONSource | undefined;
      src?.setData(buildGeoJSON(ring.current));
    } catch (e) {
      // Ignore if source missing or style removed
    }
  }, []);

  // ── Drawing logic ───────────────────────────────────────────────────────

  const startDrawing = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    ring.current = [];
    setIsDrawing(true);

    // Clear any stale preview data and show the dots layer
    const src = map.getSource(PREVIEW_SOURCE) as maplibregl.GeoJSONSource | undefined;
    src?.setData(EMPTY_FC);
    setDotsVisibility(map, true);

    map.getCanvas().style.cursor = 'crosshair';
  }, [mapRef]);

  const cancelDrawing = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    ring.current = [];
    setIsDrawing(false);

    try {
      // Clear preview and hide dots
      const src = map.getSource(PREVIEW_SOURCE) as maplibregl.GeoJSONSource | undefined;
      src?.setData(EMPTY_FC);
      setDotsVisibility(map, false);

      map.getCanvas().style.cursor = '';
    } catch (e) {
      // Map may be unmounting, ignore
    }
  }, [mapRef]);

  const finishPolygon = useCallback((_map: maplibregl.Map) => {
    if (ring.current.length < 3) {
      alert('A polygon needs at least 3 points.');
      cancelDrawing();
      return;
    }

    const closed: LngLat[] = [...ring.current, ring.current[0]];
    const plotExport = {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [closed] },
      properties: { id: 'NEW_PLOT_ID', status: 'available', price: 0, size: '0 sqft', features: [] },
    };

    console.group('📦 PlotDigitizer — New Plot Created');
    console.info('Paste the JSON below into the `features` array in src/data/plots.json:');
    console.log(JSON.stringify(plotExport, null, 2));
    console.groupEnd();

    cancelDrawing();
  }, [cancelDrawing]);

  // ── Map event listeners ─────────────────────────────────────────────────
  //   Kept in one effect to share the same isDrawing closure reference.

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !isAdminMode) return;

    // ── Click: place vertex ──

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawing) return;

      const { lng, lat } = e.lngLat;
      const pt: LngLat = [lng, lat];

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

    // ── Double-click: finish polygon ──
    // Also disable the map's built-in double-click zoom while drawing.

    const handleDblClick = (e: maplibregl.MapMouseEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      finishPolygon(map);
    };

    // ── Mouse-move: enforce crosshair cursor while drawing ──
    // MapLibre resets the cursor when hovering over interactiveLayerIds,
    // so we have to restore it on every mousemove.

    const handleMouseMove = () => {
      if (isDrawing) {
        map.getCanvas().style.cursor = 'crosshair';
      }
    };

    map.on('click', handleClick);
    map.on('dblclick', handleDblClick);
    map.on('mousemove', handleMouseMove);

    return () => {
      map.off('click', handleClick);
      map.off('dblclick', handleDblClick);
      map.off('mousemove', handleMouseMove);
    };
  }, [isAdminMode, isDrawing, mapRef, updatePreview, finishPolygon]);

  // ── Source / layer mount ────────────────────────────────────────────────

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (isAdminMode) {
      const setup = () => addSourceAndLayers(map);
      if (map.isStyleLoaded()) setup();
      else map.once('load', setup);
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
    if (!map || !isAdminMode) return;

    const container = document.createElement('div');
    container.className = 'digitizer-toolbar-mount';
    container.style.zIndex        = '20';
    container.style.marginTop     = '64px';
    container.style.pointerEvents = 'auto';
    toolbarContainerRef.current   = container;

    const control: maplibregl.IControl = {
      onAdd:    () => container,
      onRemove: () => container.remove(),
    };

    map.addControl(control, 'top-right');

    return () => {
      map.removeControl(control);
      toolbarContainerRef.current = null;
    };
  }, [isAdminMode, mapRef]);

  // ── Render ──────────────────────────────────────────────────────────────

  if (!isAdminMode || !toolbarContainerRef.current) return null;

  return createPortal(
    <DigitizerToolbar
      onStartDraw={startDrawing}
      onCancel={cancelDrawing}
      isDrawing={isDrawing}
    />,
    toolbarContainerRef.current,
  );
};

// ─── Toolbar UI ───────────────────────────────────────────────────────────────

interface ToolbarProps {
  onStartDraw: () => void;
  onCancel: () => void;
  isDrawing: boolean;
}

const DigitizerToolbar = ({ onStartDraw, onCancel, isDrawing }: ToolbarProps) => (
  <div style={{
    margin: '10px',
    background: '#1e1e2e',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    minWidth: '150px',
  }}>
    <div style={{
      fontSize: '10px', fontWeight: 700, color: '#9ca3af',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      paddingBottom: '4px', borderBottom: '1px solid #374151',
    }}>
      Plot Digitizer
    </div>

    <button
      onClick={onStartDraw}
      style={{
        padding: '6px 10px', borderRadius: '5px',
        fontSize: '12px', fontWeight: 600,
        background: isDrawing ? '#22c55e' : '#f59e0b',
        color: '#1c1c1c',
        border: 'none', cursor: 'pointer', textAlign: 'left',
      }}
    >
      {isDrawing ? '🟢 Drawing...' : '✏️ Draw Polygon'}
    </button>

    <button
      onClick={onCancel}
      style={{
        padding: '6px 10px', borderRadius: '5px',
        fontSize: '12px', fontWeight: 600,
        background: '#374151', color: '#e5e7eb',
        border: 'none', cursor: 'pointer', textAlign: 'left',
      }}
    >
      🗑️ Cancel / Clear
    </button>

    <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px', lineHeight: 1.4 }}>
      {isDrawing
        ? 'Click to place vertices.\nDbl-click or snap to first point to close.'
        : 'Click Draw to start placing vertices.'}
    </div>
  </div>
);
