import type { MapRef } from 'react-map-gl/maplibre';

/**
 * Returns the SW and NE bounding box corners for a polygon coordinate ring.
 * Used to drive fitBounds, so the camera always frames the full polygon.
 */
export const getFeatureBounds = (
  coords: number[][]
): [[number, number], [number, number]] => {
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)], // SW
    [Math.max(...lngs), Math.max(...lats)], // NE
  ];
};

/**
 * Returns the centroid [lng, lat] of a polygon coordinate ring.
 */
export const getFeatureCenter = (coords: number[][]): [number, number] => {
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2,
  ];
};

/**
 * Smoothly fits the map camera to a polygon's bounding box.
 * Consistent padding and duration across all call sites.
 */
export const fitBoundsToFeature = (
  map: ReturnType<MapRef['getMap']>,
  coords: number[][]
) => {
  map.fitBounds(getFeatureBounds(coords), {
    padding: 100,
    duration: 1000,
    essential: true,
  });
};
