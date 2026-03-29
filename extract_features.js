import fs from 'fs';

const plotsPath = 'c:/Users/punee/OneDrive/Desktop/Real-Estate-Demo-main/Real-Estate-Demo-main/src/data/plots.json';
const plotsData = JSON.parse(fs.readFileSync(plotsPath, 'utf-8'));

const allFeatures = new Set();
plotsData.features.forEach(feature => {
  if (feature.properties.features) {
    feature.properties.features.forEach(f => allFeatures.add(f));
  }
});

console.log('Unique features:', Array.from(allFeatures).sort());
