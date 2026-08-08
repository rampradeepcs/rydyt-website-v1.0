import puppeteer from 'puppeteer'
import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const FPS = 30
const DURATION = 3
const OUT_DIR = path.join(HERE, 'outro-frames')

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--force-device-scale-factor=1'] })
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 })
await page.goto('file://' + path.join(HERE, 'outro.html'), { waitUntil: 'load' })
await page.waitForFunction(() => window.__ready && true, { timeout: 60000 })
await page.evaluate(() => window.__ready)

for (let i = 0; i < FPS * DURATION; i++) {
  await page.evaluate((t) => window.seek(t), i / FPS)
  await page.screenshot({ path: path.join(OUT_DIR, `o${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 })
}
await browser.close()

execFileSync(ffmpegPath, [
  '-y', '-framerate', String(FPS), '-i', path.join(OUT_DIR, 'o%04d.jpg'),
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  path.join(HERE, 'outro.mp4'),
], { stdio: 'inherit' })
console.log('outro done')
