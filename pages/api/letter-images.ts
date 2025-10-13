import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { count } = req.query
    const requested = Number(count) || 6

    const base = path.join(process.cwd(), 'public', 'images', 'UrduLetterMatchingImages')
    if (!fs.existsSync(base)) {
      return res.status(500).json({ error: 'Images folder not found' })
    }

    let folders = fs.readdirSync(base, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)

    // If specific ids requested (comma-separated), filter folders to those
    const idsParam = Array.isArray(req.query.ids) ? req.query.ids[0] : (req.query.ids as string | undefined)
    if (idsParam) {
      const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean)
      folders = folders.filter(f => ids.includes(f))
    }

    // Choose N distinct folders at random from available folders
    const chosenFolders: string[] = []
    const pool = [...folders]
    while (chosenFolders.length < Math.min(requested, pool.length)) {
      const idx = Math.floor(Math.random() * pool.length)
      chosenFolders.push(pool.splice(idx, 1)[0])
    }

    const images = chosenFolders.map((f) => {
      const p = path.join(base, f)
      let files: string[] = []
      try {
        files = fs.readdirSync(p)
          .filter(fn => /\.(png|jpe?g|gif|webp|svg)$/i.test(fn))
      } catch (e) {
        files = []
      }
      const chosenFile = files.length ? pickRandom(files) : null
      const src = chosenFile ? `/images/UrduLetterMatchingImages/${f}/${chosenFile}` : `/images/placeholder-animal.png`
      return { id: f, src }
    })

    return res.status(200).json({ ok: true, images })
  } catch (err) {
    console.error('letter-images api error', err)
    return res.status(500).json({ error: 'internal' })
  }
}
