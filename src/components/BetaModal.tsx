import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import LogoMark from './LogoMark'
import './betamodal.css'

const EASE = [0.16, 1, 0.3, 1] as const

const APP_STORE_URL = 'https://apps.apple.com/in/app/rydyt/id6575364023'
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.moaiconsulting.rydyt&pcampaignid=web_share'

let opener: (() => void) | null = null

/** Open the Join Beta popup from anywhere. */
export function openBetaModal() {
  opener?.()
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M17.05 12.54c-.03-2.89 2.36-4.27 2.47-4.34-1.35-1.97-3.44-2.24-4.18-2.27-1.78-.18-3.47 1.05-4.37 1.05-.9 0-2.29-1.02-3.77-1-1.94.03-3.72 1.13-4.72 2.86-2.01 3.49-.51 8.66 1.45 11.49.96 1.39 2.1 2.94 3.6 2.88 1.45-.06 1.99-.93 3.74-.93s2.24.93 3.77.9c1.56-.03 2.54-1.41 3.49-2.81 1.1-1.61 1.55-3.17 1.58-3.25-.03-.01-3.03-1.16-3.06-4.58zM14.17 4.05c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.74-.74.86-1.39 2.23-1.22 3.55 1.29.1 2.6-.65 3.41-1.63z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M3.6 1.8c-.35.37-.55.94-.55 1.68v17.07c0 .74.2 1.31.56 1.66l.09.08L13.24 12.8v-.21L3.69 1.71l-.09.09z" />
      <path d="M16.42 15.99l-3.18-3.19v-.21l3.18-3.18.07.04 3.77 2.14c1.08.61 1.08 1.61 0 2.22l-3.77 2.14-.07.04z" opacity=".8" />
      <path d="M16.49 15.95l-3.25-3.25L3.6 22.29c.36.38.94.42 1.6.05l11.29-6.39z" opacity=".6" />
      <path d="M16.49 8.55L5.2 2.16c-.66-.37-1.24-.32-1.6.05l9.64 9.59 3.25-3.25z" opacity=".9" />
    </svg>
  )
}

export default function BetaModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    opener = () => setOpen(true)
    return () => {
      opener = null
    }
  }, [])

  useEffect(() => {
    if (!open) return
    window.__rydytLenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.__rydytLenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="beta-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Join the RYDYT beta"
        >
          <motion.div
            className="beta-card glass"
            initial={{ y: 46, scale: 0.94, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="beta-close"
              data-cursor="hover"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>

            <LogoMark className="beta-logo" />
            <h3 className="beta-title">
              Join the <span className="accent">RYDYT</span> beta
            </h3>
            <p className="beta-sub">
              Download the app and put your whole crew on the same road.
            </p>

            <div className="beta-stores">
              <a
                className="beta-store"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
              >
                <AppleIcon />
                <span>
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </span>
              </a>
              <a
                className="beta-store"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
              >
                <PlayIcon />
                <span>
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </span>
              </a>
            </div>

            <span className="beta-foot">Free while in early access · iOS &amp; Android</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
