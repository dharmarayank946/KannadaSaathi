import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '..', 'client', 'public', 'images', 'heritage');
fs.mkdirSync(outDir, { recursive: true });

// Complete, verified 15 images
const landmarks = [
  {
    num: 1,
    name: 'hampi.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Stone_Chariot%2C_Hampi.jpg'
  },
  {
    num: 2,
    name: 'mysore-palace.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/1280px-Mysore_Palace_Morning.jpg'
  },
  {
    num: 3,
    name: 'gol-gumbaz.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Gol_Gumbaz_-4%2C_Bijapur%2C_Karnataka.jpg'
  },
  {
    num: 4,
    name: 'badami-cave-temples.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Vishnu_image_inside_cave_number_3_in_Badami.jpg/1280px-Vishnu_image_inside_cave_number_3_in_Badami.jpg'
  },
  {
    num: 5,
    name: 'belur-chennakeshava-temple.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Chennakeshava_Temple_at_Belur.jpg/1280px-Chennakeshava_Temple_at_Belur.jpg'
  },
  {
    num: 6,
    name: 'halebidu-hoysaleswara-temple.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Hoysaleshwara_temple_in_Monsoon.JPG/1280px-Hoysaleshwara_temple_in_Monsoon.JPG'
  },
  {
    num: 7,
    name: 'shravanabelagola-gomateshwara.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Gommateshwara%2C_Shravanabelagola.jpg/1280px-Gommateshwara%2C_Shravanabelagola.jpg'
  },
  {
    num: 8,
    name: 'pattadakal-monuments.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Pattadakal_000.JPG/1280px-Pattadakal_000.JPG'
  },
  {
    num: 9,
    name: 'aihole-historic-temples.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/8th_century_Durga_temple_exterior_view%2C_Aihole_Hindu_temples_and_monuments_3.jpg/1280px-8th_century_Durga_temple_exterior_view%2C_Aihole_Hindu_temples_and_monuments_3.jpg'
  },
  {
    num: 10,
    name: 'chitradurga-fort.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/1_of_7_concentric_walled_layers_of_Chitradurga_fort.jpg'
  },
  {
    num: 11,
    name: 'bidar-fort.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Entrance_to_the_Bidar_Fort.JPG'
  },
  {
    num: 12,
    name: 'srirangapatna-fort.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/RanganathaTemple.jpg'
  },
  {
    num: 13,
    name: 'banavasi.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Banavasi_Madhukeshwara_temple.JPG/1280px-Banavasi_Madhukeshwara_temple.JPG'
  },
  {
    num: 14,
    name: 'kudalasangama.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Kudalasangama.jpg/1280px-Kudalasangama.jpg'
  },
  {
    num: 15,
    name: 'somanathapura-chennakeshava-temple.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Le_temple_de_Chennakesava_%28Somanathapura%2C_Inde%29_%2814465165685%29.jpg/1280px-Le_temple_de_Chennakesava_%28Somanathapura%2C_Inde%29_%2814465165685%29.jpg'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const cleanUrl = url.split('?')[0]; // strip query
    const client = cleanUrl.startsWith('https') ? https : http;
    const req = client.get(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(cleanUrl);
          redirectUrl = u.origin + redirectUrl;
        }
        return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP ' + res.statusCode));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 5000) {
          return reject(new Error('Too small: ' + buf.length));
        }
        fs.writeFileSync(dest, buf);
        resolve(buf.length);
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function run() {
  console.log('Downloading all 15 heritage images...');
  for (const item of landmarks) {
    const dest = path.join(outDir, item.name);
    try {
      const size = await downloadFile(item.url, dest);
      console.log(`[${item.num}/15] OK: ${item.name} -> ${(size/1024).toFixed(1)} KB`);
    } catch (e) {
      console.error(`[${item.num}/15] ERR: ${item.name} (${e.message})`);
    }
  }
}

run();
