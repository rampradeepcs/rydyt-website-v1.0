import sharp from 'sharp'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WORK = path.join(HERE, 'work')
const UIDIR = path.join(HERE, '../../public/assets')
const FPS = 24
const DS = 4 // tracking downscale

const SEGS = [
  { seg: 'seg1.mp4', ui: 'hud-stats.mp4', delay: 1.2, seed: [296, 1072, 472, 216] },
  { seg: 'seg2.mp4', ui: 'hud-regroup.mp4', delay: 1.0, seed: [332, 1032, 400, 184] },
  { seg: 'seg3.mp4', ui: 'hud-intercom.mp4', delay: 1.0, seed: [378, 1124, 316, 172] },
  { seg: 'seg4.mp4', ui: 'hud-sosbar.mp4', delay: 0.8, seed: [400, 1182, 286, 148] },
  { seg: 'seg5.mp4', ui: 'hud-stats.mp4', delay: 0.8, seed: [392, 912, 360, 168] },
]

const run = (args) => execFileSync(ffmpegPath, args, { stdio: 'pipe' })

async function grayFrame(file) {
  const { data, info } = await sharp(file)
    .resize({ width: 1080 / DS, height: 1920 / DS, fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { d: data, W: info.width, H: info.height }
}

/* sample template pixels at fractional rect via nearest neighbour */
function sampleRect(img, x, y, w, h, tw, th) {
  const out = new Float32Array(tw * th)
  for (let j = 0; j < th; j++) {
    for (let i = 0; i < tw; i++) {
      const sx = Math.min(img.W - 1, Math.max(0, Math.round(x + (i / (tw - 1)) * w)))
      const sy = Math.min(img.H - 1, Math.max(0, Math.round(y + (j / (th - 1)) * h)))
      out[j * tw + i] = img.d[sy * img.W + sx]
    }
  }
  return out
}

function ssd(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const dv = a[i] - b[i]
    s += dv * dv
  }
  return s / a.length
}

async function main() {
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

    // tracking state in downscaled coords
    let rx = cfg.seed[0] / DS, ry = cfg.seed[1] / DS
    let rw = cfg.seed[2] / DS, rh = cfg.seed[3] / DS
    const TW = 40, TH = 18 // template sampling resolution
    let img0 = await grayFrame(path.join(segDir, frames[0]))
    let tmpl = sampleRect(img0, rx, ry, rw, rh, TW, TH)
    let alpha = 1
    let sx = rx, sy = ry, sw = rw, sh = rh // smoothed
    const uiCache = { key: '', buf: null }

    for (let k = 0; k < frames.length; k++) {
      const segFrame = path.join(segDir, frames[k])
      if (k > 0) {
        const img = await grayFrame(segFrame)
        let best = null
        for (const sc of [0.965, 1, 1.035]) {
          const w2 = rw * sc, h2 = rh * sc
          for (let dy = -7; dy <= 7; dy++) {
            for (let dx = -7; dx <= 7; dx++) {
              const cand = sampleRect(img, rx + dx, ry + dy, w2, h2, TW, TH)
              const err = ssd(tmpl, cand) + (Math.abs(dx) + Math.abs(dy)) * 2 + Math.abs(sc - 1) * 800
              if (!best || err < best.err) best = { err, x: rx + dx, y: ry + dy, w: w2, h: h2, cand }
            }
          }
        }
        rx = best.x; ry = best.y; rw = best.w; rh = best.h
        // slowly refresh template toward current appearance
        for (let i = 0; i < tmpl.length; i++) tmpl[i] = tmpl[i] * 0.85 + best.cand[i] * 0.15
        // confidence: fade out when match error explodes (phone hidden/morphed away)
        const conf = best.err < 900 ? 1 : best.err < 1800 ? 1 - (best.err - 900) / 900 : 0
        alpha += Math.max(-0.12, Math.min(0.12, conf - alpha))
      }
      const A = 0.4
      sx += A * (rx - sx); sy += A * (ry - sy); sw += A * (rw - sw); sh += A * (rh - sh)

      const t = k / FPS
      const uiIdx = Math.max(0, Math.min(uiFrames.length - 1, Math.round((t - cfg.delay) * FPS)))
      // inset 2% so the UI sits inside the bezel
      const px = Math.round(sx * DS + sw * DS * 0.02)
      const py = Math.round(sy * DS + sh * DS * 0.02)
      const pw = 2 * Math.round((sw * DS * 0.96) / 2)
      const ph = 2 * Math.round((sh * DS * 0.96) / 2)
      const aQ = Math.round(Math.max(0, Math.min(1, alpha)) * 20) / 20

      if (aQ > 0.02 && pw > 40) {
        const key = `${uiIdx}|${pw}x${ph}|${aQ}`
        if (uiCache.key !== key) {
          const r = Math.max(6, Math.round(ph * 0.06))
          const mask = Buffer.from(`<svg width="${pw}" height="${ph}"><rect width="${pw}" height="${ph}" rx="${r}" fill="#fff"/></svg>`)
          let u = sharp(path.join(uiFr, uiFrames[uiIdx])).resize({ width: pw, height: ph, fit: 'fill' })
            .composite([{ input: mask, blend: 'dest-in' }]).png()
          let buf = await u.toBuffer()
          if (aQ < 1) buf = await sharp(buf).ensureAlpha().linear([1, 1, 1, aQ], [0, 0, 0, 0]).png().toBuffer()
          uiCache.key = key; uiCache.buf = buf
        }
        await sharp(segFrame).composite([{ input: uiCache.buf, left: px, top: py }]).jpeg({ quality: 95 }).toFile(path.join(outDir, frames[k]))
      } else {
        fs.copyFileSync(segFrame, path.join(outDir, frames[k]))
      }
      if (k % 60 === 0) console.log(`seg${si + 1}`, k, '/', frames.length, JSON.stringify({ x: px, w: pw, a: aQ }))
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
}
await main()
