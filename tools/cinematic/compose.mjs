import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const A = (p) => path.join(HERE, p)
const UI = (f) => path.join(HERE, '../../public/assets', f)

// screen rects per segment: [x0,y0,w0,h0] at t=0 -> [x1,y1,w1,h1] at t=12
const SEGS = [
  { seg: 'seg1.mp4', ui: 6, delay: 1.2, r0: [296, 1072, 472, 216], r1: [328, 1120, 408, 184] }, // stats
  { seg: 'seg2.mp4', ui: 7, delay: 1.0, r0: [332, 1032, 400, 184], r1: [348, 1156, 352, 160] }, // pin map
  { seg: 'seg3.mp4', ui: 8, delay: 1.0, r0: [378, 1124, 316, 172], r1: [390, 1195, 280, 150] }, // intercom
  { seg: 'seg4.mp4', ui: 9, delay: 0.8, r0: [400, 1182, 286, 148], r1: [402, 1078, 296, 165] }, // sos
  { seg: 'seg5.mp4', ui: 10, delay: 0.8, r0: [392, 912, 360, 168], r1: [380, 988, 352, 160] }, // stats(2)
]

const lerp = (a, b) => `(${a}+(${b}-${a})*min(t/12\\,1))`

let fc = '[6:v]split=2[u6][u10];'
const inputs = [
  '-i', A('segs/seg1.mp4'), '-i', A('segs/seg2.mp4'), '-i', A('segs/seg3.mp4'),
  '-i', A('segs/seg4.mp4'), '-i', A('segs/seg5.mp4'), '-i', A('outro.mp4'),
  '-i', UI('hud-stats.mp4'), '-i', UI('hud-regroup.mp4'), '-i', UI('hud-intercom.mp4'), '-i', UI('hud-sosbar.mp4'),
]

SEGS.forEach((s, i) => {
  const [x0, y0, w0, h0] = s.r0
  const [x1, y1, w1, h1] = s.r1
  const uiLabel = s.ui === 6 ? 'u6' : s.ui === 10 ? 'u10' : `${s.ui}:v`
  fc += `[${uiLabel}]fps=30,tpad=start_duration=${s.delay}:start_mode=clone:stop=-1:stop_mode=clone,` +
    `scale=w='2*trunc(${lerp(w0, w1)}/2)':h='2*trunc(${lerp(h0, h1)}/2)':eval=frame[ui${i}];` +
    `[${i}:v]fps=30,settb=AVTB[b${i}];` +
    `[b${i}][ui${i}]overlay=x='${lerp(x0, x1)}':y='${lerp(y0, y1)}':shortest=1,settb=AVTB[o${i}];`
})
fc += '[5:v]fps=30,settb=AVTB[o5];'

// crossfade chain: segs 12.04s each, 0.5s fades; outro 3s with 1s fade
fc += '[o0][o1]xfade=transition=fade:duration=0.5:offset=11.54[x1];'
fc += '[x1][o2]xfade=transition=fade:duration=0.5:offset=23.08[x2];'
fc += '[x2][o3]xfade=transition=fade:duration=0.5:offset=34.62[x3];'
fc += '[x3][o4]xfade=transition=fade:duration=0.5:offset=46.16[x4];'
fc += '[x4][o5]xfade=transition=fade:duration=1:offset=57.2[out]'

const out = process.argv[2] || path.join(process.env.HOME, 'Desktop', 'rydyt-cinematic-reel.mp4')
execFileSync(ffmpegPath, [
  '-y', ...inputs,
  '-filter_complex', fc,
  '-map', '[out]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-r', '30',
  out,
], { stdio: 'inherit' })
console.log('done →', out)
