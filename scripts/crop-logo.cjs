const path = require('path');
const fs = require('fs');

// Note: The college logo is already cropped and saved at src/assets/images/ies-ips-logo.webp.
// To run this script again, install sharp locally: npm install -D sharp
let sharp;
try {
  sharp = require('sharp');
} catch {
  console.log('sharp is not installed locally. To re-run logo cropping, run: npm install -D sharp');
  process.exit(0);
}

const inputPath = path.resolve(__dirname, '../src/assets/images/ies-ips-logo.webp');
const backupPath = path.resolve(__dirname, '../src/assets/images/ies-ips-logo-raw.webp');

async function processLogo() {
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log('Backed up original to ies-ips-logo-raw.webp');
  }

  // Exact bounds of the circular seal in raw 351x346 image:
  // Top edge: y=8
  // Bottom edge: y=338
  // Left edge: x=11
  // Right edge: x=338
  // cx = 174.5, cy = 173.0, rx = 163.5, ry = 165.0
  const cropLeft = 10;
  const cropTop = 8;
  const cropWidth = 329;
  const cropHeight = 331;

  const maskCx = 174.5 - cropLeft; // 164.5
  const maskCy = 173.0 - cropTop;  // 165.0
  const maskRx = 163.5;
  const maskRy = 165.0;

  const maskSvg = Buffer.from(`
    <svg width="${cropWidth}" height="${cropHeight}" viewBox="0 0 ${cropWidth} ${cropHeight}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${maskCx}" cy="${maskCy}" rx="${maskRx}" ry="${maskRy}" fill="white" />
    </svg>
  `);

  const buffer = await sharp(backupPath)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight
    })
    .composite([{
      input: maskSvg,
      blend: 'dest-in'
    }])
    .webp({ quality: 95, alphaQuality: 100 })
    .toBuffer();

  fs.writeFileSync(inputPath, buffer);

  const outMeta = await sharp(inputPath).metadata();
  console.log('Successfully cropped clean circular logo without white padding!');
  console.log('Output metadata:', outMeta);
}

processLogo().catch(err => {
  console.error('Failed to crop logo:', err);
  process.exit(1);
});
