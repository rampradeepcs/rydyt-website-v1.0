import puppeteer from 'puppeteer'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const FPS = 30
const DURATION = 20
const OUT_DIR = path.join(HERE, 'render')
const FINAL = process.argv[2] || path.join(process.env.HOME, 'Desktop', 'rydyt-launch-reel.mp4')

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars', '--force-device-scale-factor=1'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 })
await page.goto('file://' + path.join(HERE, 'reel.html'), { waitUntil: 'load', timeout: 60000 })
await page.waitForFunction(() => window.__ready && true, { timeout: 120000 })
await page.evaluate(() => window.__ready)
console.log('reel page ready — rendering', FPS * DURATION, 'frames')

const total = FPS * DURATION
for (let i = 0; i < total; i++) {
  const t = i / FPS
  await page.evaluate((t) => window.seek(t), t)
  await page.screenshot({
    path: path.join(OUT_DIR, `r${String(i).padStart(4, '0')}.jpg`),
    type: 'jpeg',
    quality: 90,
  })
  if (i % 60 === 0) console.log('frame', i, '/', total)
}
await browser.close()

console.log('encoding mp4…')
execFileSync(ffmpegPath, [
  '-y',
  '-framerate', String(FPS),
  '-i', path.join(OUT_DIR, 'r%04d.jpg'),
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '19',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  FINAL,
], { stdio: 'inherit' })
console.log('done →', FINAL)
