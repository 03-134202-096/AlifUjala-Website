
# Alif Ujaala – Static Next.js Site (No Backend)

- Static export (`output: 'export'`) – deploy anywhere (Hostinger, GitHub Pages, Netlify).
- Games are fully client-side: letter ↔ letter, letter ↔ image.
- Progress stored in `localStorage`.
- Worksheet download buttons generate PNG worksheets (no server/library needed).

## Run Locally
```bash
npm install
npm run dev
```
## Build Static
```bash
npm run build
# static in out/
```
## Notes
- Path alias `@/` enabled via `jsconfig.json`.
- Replace images in `public/images/` and mappings in `data/*.json`.
