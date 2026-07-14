import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LOGO_PATHS } from './LogoMark'
import './loader.css'
import { asset } from '../lib/asset'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let raf = 0
    let value = 0
    const start = performance.now()
    const img = new Image()
    let heroLoaded = false
    img.onload = () => (heroLoaded = true)
    img.onerror = () => (heroLoaded = true)
    img.src = asset('/assets/hero-hand-phone.png')

    const tick = (now: number) => {
      const t = Math.min((now - start) / 2400, 1)
      const cap = heroLoaded ? 100 : 88
      value = Math.min(Math.round(t * 100), cap)
      setProgress(value)
      if (value >= 100) {
        setTimeout(() => setLeaving(true), 250)
        setTimeout(onDone, 1150)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="loader"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="loader-center">
            <svg className="loader-logo" viewBox="-6 -6 261 260" aria-hidden>
              {LOGO_PATHS.map((d, i) => (
                <path
                  key={i}
                  className={`loader-logo-path loader-logo-path-${i}`}
                  d={d}
                  pathLength={1}
                />
              ))}
            </svg>
            <div className="loader-word" aria-label="RYDYT">
              {'RYDYT'.split('').map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.7, ease: EASE }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
            <div className="loader-track">
              <div className="loader-bar" style={{ width: `${progress}%` }} />
            </div>
            <div className="loader-pct">{progress}%</div>
          </div>
          <div className="loader-tag">RIDE SMARTER · RIDE TOGETHER</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
