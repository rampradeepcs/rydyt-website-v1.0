import ffmpegPath from 'ffmpeg-static'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const W = (p) => path.join(HERE, 'work', p)

let fc = ''
for (let i = 0; i < 5; i++) fc += `[${i}:v]fps=30,settb=AVTB[o${i}];`
fc += '[5:v]fps=30,settb=AVTB[o5];'
fc += '[o0][o1]xfade=transition=fade:duration=0.5:offset=11.54[x1];'
fc += '[x1][o2]xfade=transition=fade:duration=0.5:offset=23.08[x2];'
fc += '[x2][o3]xfade=transition=fade:duration=0.5:offset=34.62[x3];'
fc += '[x3][o4]xfade=transition=fade:duration=0.5:offset=46.16[x4];'
fc += '[x4][o5]xfade=transition=fade:duration=1:offset=57.2[out]'

const out = process.argv[2] || path.join(process.env.HOME, 'Desktop', 'rydyt-cinematic-reel.mp4')
execFileSync(ffmpegPath, [
  '-y',
  '-i', W('comp1.mp4'), '-i', W('comp2.mp4'), '-i', W('comp3.mp4'),
  '-i', W('comp4.mp4'), '-i', W('comp5.mp4'), '-i', path.join(HERE, 'outro.mp4'),
  '-filter_complex', fc, '-map', '[out]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart', '-r', '30',
  out,
], { stdio: 'inherit' })
console.log('done →', out)
