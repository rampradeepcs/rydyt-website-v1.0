import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useMagnetic } from '../hooks/useMagnetic'
import { scrollToTarget } from '../hooks/useSmoothScroll'
import LogoMark from './LogoMark'
import { openBetaModal } from './BetaModal'
import './navbar.css'

const EASE = [0.16, 1, 0.3, 1] as const

const LINKS = [
  { label: 'The Problem', href: '#problem' },
  { label: 'The App', href: '#intro' },
  { label: 'The Ride', href: '#journey' },
  { label: 'Features', href: '#features' },
  { label: 'HUD Mode', href: '#hud' },
  { label: 'Community', href: '#community' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const betaRef = useMagnetic<HTMLAnchorElement>(0.25)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'nav-scrolled' : ''}`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
      >
        <div className="nav-left">
          <a
            className="nav-logo"
            href="#top"
            data-cursor="hover"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(0)
            }}
          >
            <LogoMark className="nav-logo-mark" />
            <span className="nav-brand">RYDYT</span>
          </a>
          <button
            className="nav-menu-btn"
            data-cursor="hover"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <span className={`nav-menu-icon ${open ? 'is-open' : ''}`}>
              <Plus size={12} strokeWidth={3} />
            </span>
            <span>{open ? 'Close' : 'Menu'}</span>
          </button>
          <div className="nav-tags">
            <span>Group Rides</span>
            <span>Live Tracking</span>
          </div>
        </div>
        <div className="nav-right">
          <a
            ref={betaRef}
            className="nav-beta"
            href="#download"
            data-cursor="hover"
            onClick={(e) => {
              e.preventDefault()
              setOpen(false)
              openBetaModal()
            }}
          >
            <span className="nav-beta-dot" />
            Join Beta
          </a>
        </div>
      </motion.nav>

      <motion.div
        className="nav-overlay"
        initial={false}
        animate={
          open
            ? { clipPath: 'circle(150% at 8% 4%)' }
            : { clipPath: 'circle(0% at 8% 4%)' }
        }
        transition={{ duration: 0.8, ease: EASE }}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        <div className="nav-overlay-links">
          {LINKS.map((l, i) => (
            <motion.button
              key={l.href}
              data-cursor="hover"
              initial={false}
              animate={open ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
              transition={{ delay: open ? 0.2 + i * 0.06 : 0, duration: 0.6, ease: EASE }}
              onClick={() => go(l.href)}
            >
              <span className="nav-overlay-index">0{i + 1}</span>
              {l.label}
            </motion.button>
          ))}
        </div>
        <div className="nav-overlay-foot">
          <span>RYDYT © 2026</span>
          <span>Every ride. Every rider. Connected.</span>
        </div>
      </motion.div>
    </>
  )
}
