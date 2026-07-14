import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Fuel,
  CloudRain,
  Siren,
  Users,
  Timer,
  Flag,
  Navigation,
} from 'lucide-react'
import BikeFront from './BikeFront'
import Particles from './Particles'
import './ridejourney.css'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.16, 1, 0.3, 1] as const

type Chapter = {
  id: string
  time: string
  place: string
  title: string
  caption: string
  notif: { icon: typeof Fuel; tone: 'ok' | 'warn' | 'danger'; title: string; sub: string }
  screen?: { src: string; alt: string; label: string }
  speed: string
  eta: string
}

const CHAPTERS: Chapter[] = [
  {
    id: 'morning',
    time: '07:12',
    place: 'NH44 · Rollout',
    title: 'Morning',
    caption: 'The crew rolls out. Six bikes, one route, every turn already agreed on.',
    notif: { icon: Navigation, tone: 'ok', title: 'Ride started', sub: '6 riders synced · Salem → Vellore' },
    screen: { src: asset('/assets/hud-dashboard.png'), alt: 'RYDYT HUD navigation dashboard', label: 'Navigation Sync' },
    speed: '64',
    eta: '11:40',
  },
  {
    id: 'highway',
    time: '09:05',
    place: 'NH44 · Full pace',
    title: 'Highway',
    caption: 'Cruise formation. RYDYT watches range, pace and gaps so nobody has to.',
    notif: { icon: Fuel, tone: 'warn', title: 'Fuel warning', sub: 'Ravi · 38 km range — stop planned in 12 km' },
    screen: { src: asset('/assets/hud-pinmap.png'), alt: 'Pinned fuel stop on the route map', label: 'Smart Stops' },
    speed: '96',
    eta: '11:32',
  },
  {
    id: 'mountains',
    time: '11:48',
    place: 'Ghat section · The climb',
    title: 'Mountains',
    caption: 'Hairpins split the group. The map never loses a single rider.',
    notif: { icon: Users, tone: 'warn', title: 'Group split', sub: 'Two riders 2.4 km behind — regroup point set' },
    screen: { src: asset('/assets/hud-riders.png'), alt: 'Live rider tracking on map', label: 'Live Tracking' },
    speed: '41',
    eta: '13:05',
  },
  {
    id: 'rain',
    time: '14:20',
    place: 'Valley road · Weather shift',
    title: 'Rain',
    caption: 'The sky breaks. Everyone hears it before they feel it.',
    notif: { icon: CloudRain, tone: 'warn', title: 'Rain alert', sub: 'Grip drops in 3 km — intercom broadcast sent' },
    screen: { src: asset('/assets/hud-call.png'), alt: 'Group intercom call module', label: 'Voice Intercom' },
    speed: '58',
    eta: '15:48',
  },
  {
    id: 'night',
    time: '19:37',
    place: 'NH48 · Night ride',
    title: 'Night',
    caption: 'A bike goes down at the back. Every screen knows in under a second.',
    notif: { icon: Siren, tone: 'danger', title: 'SOS — rider down', sub: 'Uday · crash detected — routing all riders' },
    screen: { src: asset('/assets/hud-sos.png'), alt: 'SOS emergency screen', label: 'Emergency SOS' },
    speed: '0',
    eta: '—',
  },
  {
    id: 'arrival',
    time: '21:02',
    place: 'Vellore · Destination',
    title: 'Arrival',
    caption: 'Everyone in. Helmet off. The ride writes its own story — 548 km of it.',
    notif: { icon: Flag, tone: 'ok', title: 'Destination reached', sub: 'All 6 riders arrived · ETA beaten by 14 min' },
    speed: '12',
    eta: 'Arrived',
  },
]

export default function RideJourney() {
  const rootRef = useRef<HTMLElement>(null)
  const [chapter, setChapter] = useState(0)
  const chapterRef = useRef(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const bikeLean = gsap.quickTo('.journey-bike', 'rotation', { duration: 0.6, ease: 'power2.out' })
      const bikeX = gsap.quickTo('.journey-bike', 'xPercent', { duration: 1.1, ease: 'power2.out' })
      let lastP = 0

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: '+=780%',
        pin: '.journey-sticky',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          const idx = Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length))
          if (idx !== chapterRef.current) {
            chapterRef.current = idx
            setChapter(idx)
          }
          // lean with scroll velocity, drift across the lane through the ride
          const v = gsap.utils.clamp(-1, 1, (p - lastP) * 400)
          lastP = p
          bikeLean(v * 6)
          bikeX(Math.sin(p * Math.PI * 3) * 26)
          const stage = rootRef.current!.querySelector('.journey-sticky') as HTMLElement
          stage.style.setProperty('--journey-p', String(p))
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const c = CHAPTERS[chapter]
  const Icon = c.notif.icon

  return (
    <section className="journey" id="journey" ref={rootRef}>
      <div className={`journey-sticky journey-${c.id}`}>
        {/* sky + scenery */}
        <div className="journey-sky" aria-hidden>
          <div className="journey-sun" />
          <div className="journey-stars" />
          <Particles density={30} />
          <div className="journey-mountains journey-mountains-far" />
          <div className="journey-mountains journey-mountains-near" />
        </div>

        {/* the road */}
        <div className="journey-road-wrap" aria-hidden>
          <div className="journey-road">
            <div className="journey-lane" />
            <div className="journey-finish-line" />
          </div>
          <div className="journey-road-glow" />
        </div>

        {/* destination reached — checkered flag + confetti */}
        <div className="journey-finish" aria-hidden>
          <svg className="journey-flag" viewBox="0 0 96 132">
            <defs>
              <pattern id="jf-checker" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#ececef" />
                <rect x="8" y="8" width="8" height="8" fill="#ececef" />
                <rect x="8" width="8" height="8" fill="#101014" />
                <rect y="8" width="8" height="8" fill="#101014" />
              </pattern>
            </defs>
            <rect x="6" y="4" width="4" height="126" rx="2" fill="#b9b9bf" />
            <circle cx="8" cy="5" r="4.5" fill="#e8232a" />
            <g className="journey-flag-cloth">
              <path d="M10 10 L86 14 Q90 30 86 46 L10 50 Z" fill="url(#jf-checker)" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
            </g>
          </svg>
          <span className="journey-finish-tag">DESTINATION REACHED</span>
          <div className="journey-confetti">
            {Array.from({ length: 12 }).map((_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>

        {/* cinematic vignette */}
        <div className="journey-vignette" aria-hidden />

        {/* rain + night vignette overlays */}
        <div className="journey-rain-overlay" aria-hidden />
        <div className="journey-sos-pulse" aria-hidden />

        {/* the bike */}
        <div className="journey-bike-wrap" aria-hidden>
          <BikeFront className="journey-bike" />
        </div>

        {/* header */}
        <header className="journey-head">
          <p className="kicker">The ride · one day with RYDYT</p>
          <AnimatePresence mode="wait">
            <motion.h2
              key={c.id}
              className="journey-title"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              {c.title}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={c.id}
              className="journey-caption"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            >
              {c.caption}
            </motion.p>
          </AnimatePresence>
        </header>

        {/* notification card */}
        <AnimatePresence mode="wait">
          <motion.aside
            key={c.id}
            className={`journey-notif glass tone-${c.notif.tone}`}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="journey-notif-icon">
              <Icon size={17} strokeWidth={1.8} />
            </span>
            <div>
              <strong>{c.notif.title}</strong>
              <small>{c.notif.sub}</small>
            </div>
          </motion.aside>
        </AnimatePresence>

        {/* feature screen for the chapter */}
        <AnimatePresence mode="wait">
          {c.screen && (
            <motion.figure
              key={c.id}
              className="journey-screen"
              initial={{ y: 70, opacity: 0, rotate: -2 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <img src={c.screen.src} alt={c.screen.alt} loading="lazy" draggable={false} />
              <figcaption>{c.screen.label}</figcaption>
            </motion.figure>
          )}
        </AnimatePresence>

        {/* live HUD strip */}
        <footer className="journey-hud glass">
          <div className="journey-hud-cell">
            <small>Local time</small>
            <strong>{c.time}</strong>
          </div>
          <div className="journey-hud-cell">
            <small>Speed</small>
            <strong>
              {c.speed}
              <em> km/h</em>
            </strong>
          </div>
          <div className="journey-hud-cell">
            <small>ETA</small>
            <strong>{c.eta}</strong>
          </div>
          <div className="journey-hud-cell journey-hud-place">
            <small>
              <Timer size={10} /> {c.place}
            </small>
            <div className="journey-progress">
              {CHAPTERS.map((ch, i) => (
                <span key={ch.id} className={i <= chapter ? 'is-done' : ''} />
              ))}
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
