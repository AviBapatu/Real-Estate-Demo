import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { calculateImageBounds } from '../../utils/coordinateMath';
import baseMap from "../../../public/assets/map/base-map.jpg";

// Update these to your exact drone image pixel dimensions
const IMAGE_WIDTH = 4000; 
const IMAGE_HEIGHT = 2250;
const imageBounds = calculateImageBounds(IMAGE_WIDTH, IMAGE_HEIGHT);

export const MapView = () => {
  return (
    <Map
      initialViewState={{
        bounds: [
          [0, 0], // Southwest
          [imageBounds[1][0], imageBounds[0][1]] // Northeast
        ],
        fitBoundsOptions: { padding: 50 }
      }}
      mapStyle={{ version: 8, sources: {}, layers: [] }}
      style={{ width: '100%', height: '100%' }}
      // maxBounds prevents the user from panning infinitely away into the void
      maxBounds={[
        [-0.05, -0.05], // Padding left/bottom
        [imageBounds[1][0] + 0.05, imageBounds[0][1] + 0.05] // Padding right/top
      ]}
      minZoom={8} // Prevents zooming out too far
      maxZoom={18} // Prevents zooming in until pixels blur
    >
      {/* Base Drone Image Source */}
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
    </Map>
  );
};