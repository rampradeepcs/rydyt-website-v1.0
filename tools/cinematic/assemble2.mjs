import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))

// usage: node assemble2.mjs [clean] [outfile]
const clean = process.argv[2] === 'clean'
const segOf = (i) => (clean ? path.join(HERE, 'segs', `seg${i}.mp4`) : path.join(HERE, 'work', `comp${i}.mp4`))
const out =
  process.argv[3] ||
  path.join(process.env.HOME, 'Desktop', clean ? 'rydyt-cinematic-reel-clean.mp4' : 'rydyt-cinematic-reel.mp4')

const TRIM = 0.3 // shave the near-static anchor start of every incoming segment
const D = 0.45 // zoom-punch duration
const L = 12.04
const LT = L - TRIM

let fc = '[0:v]fps=30,settb=AVTB[o0];'
for (let i = 1; i < 5; i++)
  fc += `[${i}:v]trim=start=${TRIM},setpts=PTS-STARTPTS,fps=30,settb=AVTB[o${i}];`
fc += '[5:v]fps=30,settb=AVTB[o5];'

const off1 = L - D // 11.59
const off2 = off1 + LT - D // 22.88
const off3 = off2 + LT - D // 34.17
const off4 = off3 + LT - D // 45.46
const off5 = off4 + LT - 1 // outro fade 1s

fc += `[o0][o1]xfade=transition=zoomin:duration=${D}:offset=${off1}[x1];`
fc += `[x1][o2]xfade=transition=zoomin:duration=${D}:offset=${off2}[x2];`
fc += `[x2][o3]xfade=transition=zoomin:duration=${D}:offset=${off3}[x3];`
fc += `[x3][o4]xfade=transition=zoomin:duration=${D}:offset=${off4}[x4];`
fc += `[x4][o5]xfade=transition=fade:duration=1:offset=${off5}[out]`

execFileSync(ffmpegPath, [
  '-y',
  '-i', segOf(1), '-i', segOf(2), '-i', segOf(3), '-i', segOf(4), '-i', segOf(5),
  '-i', path.join(HERE, 'outro.mp4'),
  '-filter_complex', fc, '-map', '[out]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-r', '30',
  out,
], { stdio: 'inherit' })
console.log('done →', out)
