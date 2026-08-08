import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WORK = path.join(HERE, 'work')
const UIDIR = path.join(HERE, '../../public/assets')
const S = 4 // tracker downscale
const FPS = 24

// seed rects (accurate, from the segment start keyframes)
const SEGS = [
  { seg: 'seg1.mp4', ui: 'hud-stats.mp4', delay: 1.2, seed: [296, 1072, 472, 216] },
  { seg: 'seg2.mp4', ui: 'hud-regroup.mp4', delay: 1.0, seed: [332, 1032, 400, 184] },
  { seg: 'seg3.mp4', ui: 'hud-intercom.mp4', delay: 1.0, seed: [378, 1124, 316, 172] },
  { seg: 'seg4.mp4', ui: 'hud-sosbar.mp4', delay: 0.8, seed: [400, 1182, 286, 148] },
  { seg: 'seg5.mp4', ui: 'hud-stats.mp4', delay: 0.8, seed: [392, 912, 360, 168] },
]

const run = (args) => execFileSync(ffmpegPath, args, { stdio: 'pipe' })

async function grayRaw(file) {
  const { data, info } = await sharp(file)
    .resize({ width: 1080 / S, height: 1920 / S, fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, W: info.width, H: info.height }
}

function bestRect(img, prev) {
  const { data, W, H } = img
  const px = (x, y) => data[y * W + x]
  const iw = W + 1
  const integ = new Float64Array(iw * (H + 1))
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      integ[(y + 1) * iw + (x + 1)] = px(x, y) + integ[y * iw + (x + 1)] + integ[(y + 1) * iw + x] - integ[y * iw + x]
  const bs = (x0, y0, x1, y1) => integ[y1 * iw + x1] - integ[y0 * iw + x1] - integ[y1 * iw + x0] + integ[y0 * iw + x0]
  const bm = (x0, y0, x1, y1) => bs(x0, y0, x1, y1) / Math.max(1, (x1 - x0) * (y1 - y0))

  const pw = Math.round(prev.w / S), ph = Math.round(prev.h / S)
  const pcx = Math.round((prev.x + prev.w / 2) / S), pcy = Math.round((prev.y + prev.h / 2) / S)
  let best = null
  for (let dw = -4; dw <= 4; dw += 2) {
    const w = pw + dw
    const h = Math.round(w * (ph / pw))
    for (let dx = -8; dx <= 8; dx += 1) {
      for (let dy = -8; dy <= 8; dy += 1) {
        const cx = pcx + dx, cy = pcy + dy
        const x0 = cx - (w >> 1), x1 = cx + (w >> 1)
        const y0 = cy - (h >> 1), y1 = cy + (h >> 1)
        if (x0 < 1 || x1 > W - 1 || y0 < 1 || y1 > H - 1) continue
        const inner = bm(x0, y0, x1, y1)
        const ringSide = (bm(Math.max(0, x0 - 6), y0, x0, y1) + bm(x1, y0, Math.min(W, x1 + 6), y1)) / 2
        const drift = Math.abs(dx) + Math.abs(dy)
        const score = ringSide - inner * 1.6 - drift * 0.35
        if (!best || score > best.score) best = { score, x0, y0, x1, y1 }
      }
    }
  }
  return { x: best.x0 * S, y: best.y0 * S, w: (best.x1 - best.x0) * S, h: (best.y1 - best.y0) * S }
}

async function roundedUi(uiFile, w, h) {
  const r = Math.max(6, Math.round(h * 0.055))
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#fff"/></svg>`,
  )
  return sharp(uiFile)
    .resize({ width: w, height: h, fit: 'fill' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

fs.rmSync(WORK, { recursive: true, force: true })
fs.mkdirSync(WORK, { recursive: true })

for (let si = 0; si < SEGS.length; si++) {
  const cfg = SEGS[si]
  const segDir = path.join(WORK, `seg${si}`)
  const uiFr = path.join(WORK, `ui${si}`)
  const outDir = path.join(WORK, `out${si}`)
  fs.mkdirSync(segDir); fs.mkdirSync(uiFr); fs.mkdirSync(outDir)

  run(['-y', '-i', path.join(HERE, 'segs', cfg.seg), '-vf', `fps=${FPS}`, '-q:v', '2', path.join(segDir, 'f%05d.jpg')])
  run(['-y', '-i', path.join(UIDIR, cfg.ui), '-vf', `fps=${FPS}`, '-q:v', '2', path.join(uiFr, 'u%05d.jpg')])

  const frames = fs.readdirSync(segDir).sort()
  const uiFrames = fs.readdirSync(uiFr).sort()
  let rect = { x: cfg.seed[0], y: cfg.seed[1], w: cfg.seed[2], h: cfg.seed[3] }
  let sm = { ...rect }
  const uiCache = new Map()

  for (let k = 0; k < frames.length; k++) {
    const segFrame = path.join(segDir, frames[k])
    const img = await grayRaw(segFrame)
    rect = bestRect(img, rect)
    // exponential smoothing kills jitter
    const A = 0.35
    sm = {
      x: sm.x + A * (rect.x - sm.x),
      y: sm.y + A * (rect.y - sm.y),
      w: sm.w + A * (rect.w - sm.w),
      h: sm.h + A * (rect.h - sm.h),
    }
    const t = k / FPS
    const uiIdx = Math.max(0, Math.min(uiFrames.length - 1, Math.round((t - cfg.delay) * FPS)))
    const w2 = 2 * Math.round(sm.w / 2), h2 = 2 * Math.round(sm.h / 2)
    const key = `${uiIdx}|${w2}x${h2}`
    let uiBuf = uiCache.get(key)
    if (!uiBuf) {
      uiBuf = await roundedUi(path.join(uiFr, uiFrames[uiIdx]), w2, h2)
      uiCache.clear()
      uiCache.set(key, uiBuf)
    }
    await sharp(segFrame)
      .composite([{ input: uiBuf, left: Math.round(sm.x), top: Math.round(sm.y) }])
      .jpeg({ quality: 95 })
      .toFile(path.join(outDir, frames[k]))
    if (k % 60 === 0) console.log(`seg${si + 1}`, k, '/', frames.length, JSON.stringify({ x: Math.round(sm.x), y: Math.round(sm.y), w: Math.round(sm.w) }))
  }

  run(['-y', '-framerate', String(FPS), '-i', path.join(outDir, 'f%05d.jpg'),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
    path.join(WORK, `comp${si + 1}.mp4`)])
  fs.rmSync(segDir, { recursive: true, force: true })
  fs.rmSync(uiFr, { recursive: true, force: true })
  fs.rmSync(outDir, { recursive: true, force: true })
  console.log(`seg${si + 1} composited`)
}
console.log('all segments tracked + composited')
