const fs = require('fs');
const sharp = require('./server/node_modules/sharp');

async function exportPng() {
  const svgBuffer = fs.readFileSync('client/public/logo/kannadasaathi-logo.svg');
  
  await sharp(svgBuffer, { density: 300 })
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile('client/public/logo/kannadasaathi-logo.png');

  console.log('Exported client/public/logo/kannadasaathi-logo.png (1024x1024) successfully!');
}

exportPng().catch(console.error);
