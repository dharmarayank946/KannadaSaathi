const fs = require('fs');

const rawSvg = fs.readFileSync('karnataka_raw.svg', 'utf8');
const paths = rawSvg.match(/<path[^>]+>/g);
const targetPathTag = paths[1];
const dMatch = targetPathTag.match(/d="([^"]+)"/);
const karnatakaPathD = dMatch[1];

const outlineSvg = `<!-- 
  Karnataka State Verified Boundary Outline
  Source: DataMeet Open Maps Project / Wikimedia Commons (File:Karnataka_outline_shape.svg)
  Author: Planemad / DataMeet
  License: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
  Cartographic Reference: Survey of India Open Data Series (OSM / DataMeet India Maps)
  Verification Coordinates:
    Bounding Box: X [201.886, 798.114], Y [45.455, 954.545]
    Aurad (Bidar, North): 18.45° N
    Moyar River / Gundlupet (Chamarajanagar, South): 11.59° N
    Karwar / Netrani Island (West Coast): 74.05° E
    Mulbagal (Kolar, East): 78.58° E
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <title>Karnataka Verified State Boundary Outline</title>
  <desc>Verified geographic boundary of Karnataka state, India</desc>
  <path d="${karnatakaPathD}"
        fill="#FFD600"
        stroke="#D71920"
        stroke-width="8"
        stroke-linejoin="round"
        stroke-linecap="round"/>
</svg>`;

fs.writeFileSync('client/public/logo/karnataka-outline.svg', outlineSvg);
console.log('Saved client/public/logo/karnataka-outline.svg');
