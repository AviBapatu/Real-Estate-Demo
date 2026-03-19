// Define the exact 4-corner tuple type MapLibre expects
type CoordinateTuple = [number, number];
type ImageBounds = [CoordinateTuple, CoordinateTuple, CoordinateTuple, CoordinateTuple];

export const calculateImageBounds = (width: number, height: number): ImageBounds => {
  const scale = 10000; 
  const lonSpan = width / scale;
  const latSpan = height / scale;

  return [
    [0, latSpan],       // Top-Left
    [lonSpan, latSpan], // Top-Right
    [lonSpan, 0],       // Bottom-Right
    [0, 0]              // Bottom-Left
  ];
};