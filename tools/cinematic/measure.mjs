import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const S = 4 // downscale factor

async function findScreen(file) {
  const { data, info } = await sharp(file)
    .resize({ width: 1080 / S, height: 1920 / S, fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const W = info.width
  const px = (x, y) => data[y * W + x]

  // integral image for fast box sums
  const iw = W + 1
  const integ = new Float64Array(iw * (info.height + 1))
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < W; x++)
      integ[(y + 1) * iw + (x + 1)] =
        px(x, y) + integ[y * iw + (x + 1)] + integ[(y + 1) * iw + x] - integ[y * iw + x]
  const boxSum = (x0, y0, x1, y1) =>
    integ[y1 * iw + x1] - integ[y0 * iw + x1] - integ[y1 * iw + x0] + integ[y0 * iw + x0]
  const boxMean = (x0, y0, x1, y1) => boxSum(x0, y0, x1, y1) / Math.max(1, (x1 - x0) * (y1 - y0))

  let best = null
  // search: screen center x 95..175, y 245..390 (scaled), width 84..150, aspect ~2.15
  for (let w = 84; w <= 150; w += 2) {
    const h = Math.round(w / 2.15)
    for (let cx = 95; cx <= 175; cx += 2) {
      for (let cy = 245; cy <= 400; cy += 2) {
        const x0 = cx - (w >> 1), x1 = cx + (w >> 1)
        const y0 = cy - (h >> 1), y1 = cy + (h >> 1)
        if (x0 < 2 || x1 > W - 2 || y0 < 2 || y1 > info.height - 2) continue
        const inner = boxMean(x0, y0, x1, y1)
        if (inner > 70) continue
        // ring: sides + below emphasized (above may be dark windscreen)
        const ringSide =
          (boxMean(Math.max(0, x0 - 10), y0, x0, y1) + boxMean(x1, y0, Math.min(W, x1 + 10), y1)) / 2
        const ringBelow = boxMean(x0, y1, x1, Math.min(info.height, y1 + 8))
        const score = ringSide * 1.4 + ringBelow * 0.6 - inner * 2.0
        if (!best || score > best.score) best = { score, x0, y0, x1, y1, inner, ringSide }
      }
    }
  }
  return {
    x: best.x0 * S,
    y: best.y0 * S,
    w: (best.x1 - best.x0) * S,
    h: (best.y1 - best.y0) * S,
    inner: Math.round(best.inner),
    ring: Math.round(best.ringSide),
  }
}

const out = {}
for (const f of fs.readdirSync(path.join(HERE, 'frames')).filter((f) => f.endsWith('.png'))) {
  out[f] = await findScreen(path.join(HERE, 'frames', f))
  console.log(f, JSON.stringify(out[f]))
}
fs.writeFileSync(path.join(HERE, 'rects.json'), JSON.stringify(out, null, 1))
