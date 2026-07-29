import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SITE = 'https://rampradeepcs.github.io/rydyt-website-v1.0/'
const HERE = path.dirname(fileURLToPath(import.meta.url))

async function capture({ name, width, height, dpr, frames, settle = 90 }) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--hide-scrollbars', '--mute-audio', '--autoplay-policy=no-user-gesture-required'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: dpr })
  await page.goto(SITE, { waitUntil: 'networkidle2', timeout: 90000 })
  await page.waitForFunction(() => !document.querySelector('.loader'), { timeout: 30000 }).catch(() => {})
  await new Promise((r) => setTimeout(r, 3000)) // let the hero entrance settle
  await page.evaluate(() => {
    if (window.__rydytLenis) window.__rydytLenis.destroy()
    const c = document.querySelector('.cursor-dot')
    if (c) c.style.display = 'none'
    document.documentElement.style.scrollBehavior = 'auto'
  })
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const dir = path.join(HERE, 'frames', name)
  fs.mkdirSync(dir, { recursive: true })
  for (let i = 0; i < frames; i++) {
    const y = Math.round((max * i) / (frames - 1))
    await page.evaluate((y) => {
      window.scrollTo(0, y)
      window.dispatchEvent(new Event('scroll'))
    }, y)
    await new Promise((r) => setTimeout(r, settle))
    await page.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 82 })
    if (i % 40 === 0) console.log(name, i, '/', frames, 'y=', y, '/', max)
  }
  await browser.close()
  console.log(name, 'done —', frames, 'frames')
}

await capture({ name: 'desktop', width: 1440, height: 900, dpr: 1, frames: 426, settle: 80 })
await capture({ name: 'mobile', width: 390, height: 844, dpr: 2, frames: 288, settle: 80 })
console.log('capture complete')
