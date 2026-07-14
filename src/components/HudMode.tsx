import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Gauge, PhoneCall, Siren, MapPin } from 'lucide-react'
import './hudmode.css'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

const HUD_CARDS = [
  { icon: Gauge, title: 'Glance-speed stats', sub: 'Speed, altitude, weather — readable at 100 km/h.' },
  { icon: PhoneCall, title: 'Free intercom', sub: 'Group voice without hardware. Join with one tap.' },
  { icon: Siren, title: 'SOS on the bar', sub: 'The red button is always one thumb away.' },
  { icon: MapPin, title: 'Pin & regroup', sub: 'Drop a stop, everyone gets the detour instantly.' },
]

export default function HudMode() {
  const rootRef = useRef<HTMLElement>(null)

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
            src={asset('/assets/hud-stats.mp4')}
            autoPlay
            muted
            loop
            playsInline
            aria-label="RYDYT HUD mode showing live ride statistics"
          />
        </div>
      </div>

      <div className="hud-cards">
        {HUD_CARDS.map((c) => (
          <article className="hud-card glass" key={c.title} data-cursor="hover">
            <c.icon size={20} strokeWidth={1.6} />
            <h3>{c.title}</h3>
            <p>{c.sub}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
