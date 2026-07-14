import { useEffect, useRef } from 'react'

type Props = { density?: number; className?: string }

/** Lightweight ambient particle field on canvas. */
export default function Particles({ density = 70, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let raf = 0

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; red: boolean }
    let dots: P[] = []

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      w = canvas.width = rect.width * devicePixelRatio
      h = canvas.height = rect.height * devicePixelRatio
      dots = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.4 + 0.4) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.12 * devicePixelRatio,
        vy: -(Math.random() * 0.22 + 0.05) * devicePixelRatio,
        a: Math.random() * 0.5 + 0.1,
        red: Math.random() < 0.28,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of dots) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -4) {
          p.y = h + 4
          p.x = Math.random() * w
        }
        if (p.x < -4) p.x = w + 4
        if (p.x > w + 4) p.x = -4
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.red
          ? `rgba(232,35,42,${p.a})`
          : `rgba(255,255,255,${p.a * 0.55})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [density])

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden
    />
  )
}
