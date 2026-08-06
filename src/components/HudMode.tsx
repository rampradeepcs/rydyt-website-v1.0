import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Gauge, PhoneCall, Siren, MapPin } from 'lucide-react'
import './hudmode.css'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

const HUD_CARDS = [
  {
    icon: Gauge,
    title: 'Glance-speed stats',
    sub: 'Speed, altitude, weather — readable at 100 km/h.',
    video: '/assets/hud-stats.mp4',
  },
  {
    icon: PhoneCall,
    title: 'Free intercom',
    sub: 'Group voice without hardware. Join with one tap.',
    video: '/assets/hud-intercom.mp4',
  },
  {
    icon: Siren,
    title: 'SOS on the bar',
    sub: 'The red button is always one thumb away.',
    video: '/assets/hud-sosbar.mp4',
  },
  {
    icon: MapPin,
    title: 'Pin & regroup',
    sub: 'Drop a stop, everyone gets the detour instantly.',
    video: '/assets/hud-regroup.mp4',
  },
]

export default function HudMode() {
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [progress, setProgress] = useState(0)

  /* entrance animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hud-device',
        { rotateX: 32, y: 120, opacity: 0.3, scale: 0.9 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 80%',
            end: 'top 15%',
            scrub: 0.6,
          },
        },
      )
      gsap.fromTo(
        '.hud-card',
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.hud-cards', start: 'top 82%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  /* only run the tab cycle while the section is on screen */
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: '100px 0px',
    })
    io.observe(rootRef.current!)
    return () => io.disconnect()
  }, [])

  /* drive playback per active tab / visibility */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (inView) v.play().catch(() => {})
    else v.pause()
  }, [inView, active])

  const card = HUD_CARDS[active]

  return (
    <section className="section hud" id="hud" ref={rootRef}>
      <div className="hud-head">
        <p className="kicker">HUD mode</p>
        <h2 className="h-lg">
          Mount it. <span className="accent">Ride it.</span>
        </h2>
        <p className="lead">
          Rotate the phone, clamp it to the bar, and RYDYT becomes a full
          riding dashboard — navigation, telemetry and the crew, all at a glance.
        </p>
      </div>

      <div className="hud-stage">
        <div className="hud-device" data-cursor="hover">
          <div className="hud-device-glow" />
          <video
            ref={videoRef}
            key={card.video}
            src={asset(card.video)}
            muted
            playsInline
            preload="auto"
            autoPlay={inView}
            aria-label={`RYDYT HUD mode — ${card.title}`}
            onTimeUpdate={(e) => {
              const el = e.currentTarget
              if (el.duration) setProgress(el.currentTime / el.duration)
            }}
            onEnded={() => {
              setProgress(0)
              setActive((i) => (i + 1) % HUD_CARDS.length)
            }}
          />
        </div>
      </div>

      <div className="hud-cards" role="tablist" aria-label="HUD mode features">
        {HUD_CARDS.map((c, i) => (
          <button
            className={`hud-card glass ${i === active ? 'is-active' : ''}`}
            key={c.title}
            data-cursor="hover"
            role="tab"
            aria-selected={i === active}
            onClick={() => {
              setProgress(0)
              setActive(i)
            }}
          >
            <c.icon size={20} strokeWidth={1.6} />
            <h3>{c.title}</h3>
            <p>{c.sub}</p>
            <span
              className="hud-card-progress"
              style={{ transform: `scaleX(${i === active ? progress : 0})` }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
