import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, basename, relative } from 'path';

const PUBLIC_DIR = 'public';
// Convert all PNGs inside public/imagess
const SCAN_DIR = join(PUBLIC_DIR, 'images');

async function findPngs(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findPngs(fullPath)));
    } else if (extname(entry.name).toLowerCase() === '.png') {
      results.push(fullPath);
    }
  }
  return results;
}

async function convert() {
  const pngs = await findPngs(SCAN_DIR);
  console.log(`Found ${pngs.length} PNG files\n`);

  let converted = 0;
  let skipped = 0;
  let totalSavedBytes = 0;

  for (const png of pngs) {
    const webp = png.replace(/\.png$/i, '.webp');
    const rel = relative(PUBLIC_DIR, png);
    try {
      // Skip if webp already exists and is non-zero
      try {
        const ws = await stat(webp);
        if (ws.size > 0) { skipped++; continue; }
      } catch {}

      await sharp(png)
        .webp({ quality: 80, effort: 6 })
        .toFile(webp);

      const pngStat  = await stat(png);
      const webpStat = await stat(webp);
      const savedKB  = ((pngStat.size - webpStat.size) / 1024).toFixed(0);
      const pct      = ((1 - webpStat.size / pngStat.size) * 100).toFixed(1);
      totalSavedBytes += pngStat.size - webpStat.size;
      console.log(`  ✅ ${rel}  (${(pngStat.size/1024).toFixed(0)}KB → ${(webpStat.size/1024).toFixed(0)}KB, −${pct}%)`);
      converted++;
    } catch (err) {
      console.error(`  ❌ ${rel}: ${err.message}`);
    }
  }

  console.log(`\n════════════════════════════════`);
  console.log(`Converted : ${converted}`);
  console.log(`Skipped   : ${skipped} (webp already exists)`);
  console.log(`Total PNGs: ${pngs.length}`);
  console.log(`Saved     : ${(totalSavedBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`════════════════════════════════\n`);
}

convert();
