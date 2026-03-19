import { useRef, useEffect, useCallback } from 'react';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useMapStore } from '../store/useMapStore';
import { fitBoundsToFeature, getFeatureCenter } from '../utils/mapUtils';
import plotData from '../data/plots.json';

/**
 * The Map Engine — all imperative map logic lives here.
 * 
 * Responsibilities:
 *  - Syncs searchQuery/searchFilter → WebGL feature state (GPU-direct, no React re-render)
 *  - Teleports camera when search narrows to exactly 1 match
 *  - Manages hover feature state and cursor style
 *  - Handles plot click: opens sidebar + fits camera to polygon bounds
 *
 * Returns only the event handlers the <Map> component needs to attach.
 */
export const useMapEngine = (mapRef: React.RefObject<MapRef>) => {
  const hoveredPolygonId = useRef<string | null>(null);
  const {
    searchQuery,
    searchFilter,
    setActivePlot,
    setSelectedPlot,
  } = useMapStore();

  // ─── Search Sync ──────────────────────────────────────────────────────────
  // Pushes isMatched state directly to WebGL memory on every query change.
  // Never touches React state → zero risk of triggering a map re-render.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !map.isStyleLoaded() || !map.getSource('plots-source')) return;

    const query = searchQuery.toLowerCase().trim();

    const matchedFeatures = plotData.features.filter((feature) => {
      const props = feature.properties as any;
      if (!query) return true;

      if (searchFilter === 'id' && props.id)
        return props.id.toLowerCase().includes(query);
      if (searchFilter === 'size' && props.size)
        return props.size.toLowerCase().includes(query);
      if (searchFilter === 'features' && props.features)
        return props.features.some((f: string) => f.toLowerCase().includes(query));
      return false;
    });

    const matchedIds = new Set(matchedFeatures.map((f) => (f.properties as any).id));

    // Update every feature's isMatched state in one pass
    plotData.features.forEach((feature) => {
      const id = (feature.properties as any).id;
      map.setFeatureState(
        { source: 'plots-source', id },
        { isMatched: !query || matchedIds.has(id) }
      );
    });

    // "Teleport" effect: single match → fly to it immediately
    if (query && matchedFeatures.length === 1) {
      fitBoundsToFeature(map, matchedFeatures[0].geometry.coordinates[0]);
    }
  }, [searchQuery, searchFilter, mapRef]);

  // ─── Hover ────────────────────────────────────────────────────────────────
  const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
    if (!e.features || e.features.length === 0) return;
    const map = mapRef.current?.getMap();
    if (!map) return;

    const currentHoverId = hoveredPolygonId.current;
    const newHoverId = e.features[0].properties?.id as string | undefined;

    if (currentHoverId && currentHoverId !== newHoverId) {
      map.setFeatureState({ source: 'plots-source', id: currentHoverId }, { hover: false });
    }

    if (newHoverId) {
      hoveredPolygonId.current = newHoverId;
      map.setFeatureState({ source: 'plots-source', id: newHoverId }, { hover: true });
      map.getCanvas().style.cursor = 'pointer';
    }
  }, [mapRef]);

  const onMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap();
    const currentHoverId = hoveredPolygonId.current;

    if (map && currentHoverId) {
      map.setFeatureState({ source: 'plots-source', id: currentHoverId }, { hover: false });
    }
    hoveredPolygonId.current = null;
    if (map) map.getCanvas().style.cursor = '';
  }, [mapRef]);

  // ─── Click ────────────────────────────────────────────────────────────────
  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();

    if (e.features && e.features.length > 0) {
      const clickedPlotId = e.features[0].properties?.id;
      if (!clickedPlotId) return;

      setActivePlot(clickedPlotId);

      const match = plotData.features.find(
        (f) => f.properties.id === clickedPlotId
      );

      if (match) {
        const coords = match.geometry.coordinates[0];
        const [centerLng, centerLat] = getFeatureCenter(coords);

        setSelectedPlot({
          properties: match.properties as any,
          coordinates: [centerLng, centerLat],
        });

        if (map) fitBoundsToFeature(map, coords);
      }
      return;
    }

    // Empty click — deselect everything, log coords for debugging
    setActivePlot(null);
    setSelectedPlot(null);
    console.log(`[${e.lngLat.lng.toFixed(4)}, ${e.lngLat.lat.toFixed(4)}],`);
  }, [mapRef, setActivePlot, setSelectedPlot]);

  return { onMouseMove, onMouseLeave, handleMapClick };
};
