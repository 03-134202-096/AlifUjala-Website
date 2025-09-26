
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

## Deployment / Environment variables

This project requires a database connection (Neon/Postgres) and a session secret for production. Keep secrets out of source control.

Local (development)
- Create a `.env` file at the project root (DO NOT commit this file).
- Add the following variables:

```properties
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require&channel_binding=require
SESSION_SECRET=<a long random string, at least 48 bytes hex or base64>
```

Replace the placeholders with values from your Neon project. For `SESSION_SECRET` you can generate one locally via Node:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Vercel (production)
- In your Vercel project settings → Environment Variables, add:
	- `DATABASE_URL` = your Neon connection string (do NOT wrap with single quotes)
	- `SESSION_SECRET` = the same long secret used by your server
- Recommended Build Command (so Prisma runs and migrations apply during deploy):

```
npx prisma generate && npx prisma migrate deploy && npm run build
```

Notes
- Do not paste `.env` into Vercel; use the Vercel UI to set each environment variable.
- If you committed Prisma migrations (`prisma/migrations`) to the repo, `prisma migrate deploy` will apply them during deploy. If you didn't commit migrations, use `prisma db push` instead (less safe for production schema evolution).

