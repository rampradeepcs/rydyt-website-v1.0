import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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
      const t = Math.min((now - start) / 1800, 1)
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
            <svg
              className="loader-helmet"
              viewBox="0 0 120 100"
              fill="none"
              aria-hidden
            >
              {/* helmet shell */}
              <path
                className="lh-path lh-1"
                d="M14 62 C14 30 34 12 60 12 C86 12 106 30 106 62 L106 74 C106 80 102 84 96 84 L88 84"
              />
              {/* visor */}
              <path
                className="lh-path lh-2"
                d="M30 52 C42 44 78 44 92 52 C92 62 84 70 60 70 C40 70 30 62 30 52 Z"
              />
              {/* chin bar */}
              <path
                className="lh-path lh-3"
                d="M14 62 L14 72 C14 80 20 84 28 84 L52 84"
              />
              {/* vent line */}
              <path className="lh-path lh-4" d="M52 24 C58 22 64 22 70 24" />
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
