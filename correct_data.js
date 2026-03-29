import fs from 'fs';

const plotsPath = 'c:/Users/punee/OneDrive/Desktop/Real-Estate-Demo-main/Real-Estate-Demo-main/src/data/plots.json';
const plotsData = JSON.parse(fs.readFileSync(plotsPath, 'utf-8'));

plotsData.features.forEach(feature => {
  const props = feature.properties;
  
  if (props.features) {
    // 1. Standardize hyphenated names to spaces
    props.features = props.features.map(f => f.replace(/-/g, ' '));
    
    // 2. Specific correction for Plot 04
    if (props.id === '04') {
      // User says 04 is "park facing"
      props.features = props.features.filter(f => f !== 'corner'); // Remove corner
      if (!props.features.includes('park facing')) {
        props.features.push('park facing');
      }
      delete props.distanceFromRoad; // Remove corner-specific property
    }
  }
});

fs.writeFileSync(plotsPath, JSON.stringify(plotsData, null, 2), 'utf-8');
console.log('Successfully standardized features and corrected Plot 04.');
