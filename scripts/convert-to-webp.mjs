import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_IMAGES = 'public/images';

async function findPngs(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findPngs(fullPath));
    } else if (extname(entry.name).toLowerCase() === '.png') {
      results.push(fullPath);
    }
  }
  return results;
}

async function convert() {
  const pngs = await findPngs(PUBLIC_IMAGES);
  console.log(`Found ${pngs.length} PNG files to convert`);
  
  let converted = 0;
  let skipped = 0;
  
  for (const png of pngs) {
    const webp = png.replace(/\.png$/i, '.webp');
    try {
      // Check if webp already exists
      try {
        await stat(webp);
        skipped++;
        continue;
      } catch {}
      
      await sharp(png)
        .webp({ quality: 80 })
        .toFile(webp);
      
      const pngStat = await stat(png);
      const webpStat = await stat(webp);
      const savings = ((1 - webpStat.size / pngStat.size) * 100).toFixed(1);
      console.log(`✓ ${basename(png)} → .webp (${savings}% smaller)`);
      converted++;
    } catch (err) {
      console.error(`✗ ${basename(png)}: ${err.message}`);
    }
  }
  
  console.log(`\nDone! Converted: ${converted}, Skipped: ${skipped}, Total: ${pngs.length}`);
}

convert();
