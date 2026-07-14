import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  MapPinned,
  UserPlus,
  Route,
  Radar,
  Siren,
  BarChart3,
} from 'lucide-react'
import './howitworks.css'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { icon: MapPinned, title: 'Create Ride', sub: 'Drop a route, set the pace, pick the stops.' },
  { icon: UserPlus, title: 'Invite Riders', sub: 'One link. The whole crew is in.' },
  { icon: Route, title: 'Navigation Sync', sub: 'Every rider sees the same turn at the same time.' },
  { icon: Radar, title: 'Live Tracking', sub: 'Positions, speed and gaps — always visible.' },
  { icon: Siren, title: 'Emergency Alerts', sub: 'Crash detection pings the group instantly.' },
  { icon: BarChart3, title: 'Ride Analytics', sub: 'Distance, lean, altitude — the whole story after.' },
]

export default function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const line = document.querySelector('.hiw-line-progress') as SVGPathElement | null
      if (line) {
        const len = line.getTotalLength()
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hiw-steps',
            start: 'top 75%',
            end: 'bottom 55%',
            scrub: 0.5,
          },
        })
      }
      gsap.utils.toArray<HTMLElement>('.hiw-step').forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 78%' },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section hiw" ref={rootRef}>
      <div className="hiw-head">
        <p className="kicker">How it works</p>
        <h2 className="h-lg">
          Six moves. <span className="accent">Zero chaos.</span>
        </h2>
      </div>

      <div className="hiw-steps">
        <svg className="hiw-line" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden>
          <path d="M2 0 L2 100" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path className="hiw-line-progress" d="M2 0 L2 100" stroke="#e8232a" strokeWidth="2" />
        </svg>
        {STEPS.map((s, i) => (
          <article className={`hiw-step ${i % 2 ? 'hiw-step-right' : ''}`} key={s.title}>
            <div className="hiw-card glass" data-cursor="hover">
              <div className="hiw-icon">
                <s.icon size={20} strokeWidth={1.6} />
              </div>
              <div>
                <span className="hiw-index">STEP 0{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.sub}</p>
              </div>
            </div>
            <span className="hiw-node" aria-hidden />
          </article>
        ))}
      </div>
    </section>
  )
}
