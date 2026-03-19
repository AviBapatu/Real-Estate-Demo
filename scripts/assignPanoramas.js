import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const plotsPath = path.join(__dirname, '..', 'src', 'data', 'plots.json');
const assetsDir = path.join(__dirname, '..', 'public', 'assets', '360');

// Read existing plots
let plotsData;
try {
  plotsData = JSON.parse(fs.readFileSync(plotsPath, 'utf-8'));
} catch (e) {
  console.error("Failed to read plots.json:", e);
  process.exit(1);
}

// Read images
const files = fs.readdirSync(assetsDir);
const images = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg')).filter(f => !f.includes('sample1.bak.jpg'));

if (images.length === 0) {
  console.error("No images found in public/assets/360");
  process.exit(1);
}

// Assign randomly
let modifiedCount = 0;
plotsData.features.forEach((feature, index) => {
  // Give each plot a different image if possible, but random
  const randomImage = images[Math.floor(Math.random() * images.length)];
  if (!feature.properties) feature.properties = {};
  feature.properties.panorama = `/assets/360/${randomImage}`;
  modifiedCount++;
});

// Write back
fs.writeFileSync(plotsPath, JSON.stringify(plotsData, null, 2), 'utf-8');
console.log(`Successfully assigned panoramas to ${modifiedCount} plots.`);
