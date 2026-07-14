import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, ChevronDown } from 'lucide-react'
import MagneticButton from './MagneticButton'
import Particles from './Particles'
import './hero.css'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.16, 1, 0.3, 1] as const

const CHIPS = [
  { label: 'Navigation synced', sub: 'Salem → Vellore', pos: 'chip-a', delay: 1.4 },
  { label: '5 riders connected', sub: 'Intercom live', pos: 'chip-b', delay: 1.7 },
  { label: 'SOS armed', sub: 'Crash detection on', pos: 'chip-c', delay: 2.0 },
]

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  /* mouse parallax on the phone scene */
  useEffect(() => {
    const scene = sceneRef.current!
    if (window.matchMedia('(pointer: coarse)').matches) return
    const xTo = gsap.quickTo(scene, 'rotationY', { duration: 0.9, ease: 'power3.out' })
    const yTo = gsap.quickTo(scene, 'rotationX', { duration: 0.9, ease: 'power3.out' })
    const move = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      xTo(nx * 10)
      yTo(-ny * 6)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  /* scroll-out: content parts away as you leave the hero */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-copy', {
        yPercent: -22,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom 40%',
          scrub: true,
        },
      })
      gsap.to('.hero-scene-wrap', {
        yPercent: 12,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-bg">
        <div className="hero-grid" />
        <div className="hero-horizon" />
        <div className="hero-beam hero-beam-1" />
        <div className="hero-beam hero-beam-2" />
        <Particles density={80} />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p
            className="kicker"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
          >
            The riding companion platform
          </motion.p>

          <h1 className="hero-title" aria-label="Ride Smarter. Ride Together.">
            <span className="reveal-line">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.65, duration: 1, ease: EASE }}
              >
                Ride Smarter.
              </motion.span>
            </span>
            <span className="reveal-line">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, duration: 1, ease: EASE }}
              >
                Ride <em>Together.</em>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="lead hero-lead"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8, ease: EASE }}
          >
            Experience the future of group motorcycle riding — synced
            navigation, live tracking, intercom and SOS, engineered into one
            companion.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.8, ease: EASE }}
          >
            <MagneticButton href="#journey">Explore</MagneticButton>
            <MagneticButton variant="ghost" href="#features">
              <Play size={13} /> Watch Demo
            </MagneticButton>
            <MagneticButton variant="ghost" href="#download">
              Join Beta
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          className="hero-scene-wrap"
          initial={{ opacity: 0, y: 90, scale: 1.04 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 1.6, ease: EASE }}
        >
          <div className="hero-scene" ref={sceneRef}>
            <div className="hero-phone-glow" />
            <div className="robo-hand-wrap">
              <div className="robo-phone-wrap">
                <motion.img
                  src={asset('/assets/dashboard-phone.png')}
                  alt="RYDYT dashboard on a phone"
                  draggable={false}
                  initial={{ opacity: 0, y: 60, scale: 1.06 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.5, duration: 1.8, ease: EASE }}
                />
              </div>
              <motion.img
                className="robo-hand-img"
                src={asset('/assets/robo-hand.png')}
                alt="Silver robotic hand holding the phone"
                draggable={false}
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 1.6, ease: EASE }}
              />
            </div>
            {CHIPS.map((c) => (
              <motion.div
                key={c.label}
                className={`hero-chip glass ${c.pos}`}
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: c.delay, duration: 0.9, ease: EASE }}
              >
                <span className="hero-chip-dot" />
                <div>
                  <strong>{c.label}</strong>
                  <small>{c.sub}</small>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <span>Scroll to begin the ride</span>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  )
}
