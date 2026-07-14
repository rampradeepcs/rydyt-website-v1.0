import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './problem.css'

gsap.registerPlugin(ScrollTrigger)

const PAINS = [
  { title: 'Riders get lost', sub: 'One wrong exit and the group splits' },
  { title: 'Comms break down', sub: 'Hand signals die past 60 km/h' },
  { title: 'Fuel runs dry', sub: 'Nobody plans the stops' },
  { title: 'Weather surprises', sub: 'Rain hits half the convoy' },
  { title: 'Emergencies go unseen', sub: 'A crash at the back, noticed 20 km later' },
]

/* five riders start as a convoy, then scatter */
const RIDERS = [
  { cx: 200, scatter: { x: -120, y: -60 }, color: '#e8232a' },
  { cx: 240, scatter: { x: 60, y: -110 }, color: '#3b82f6' },
  { cx: 280, scatter: { x: 150, y: 40 }, color: '#a3e635' },
  { cx: 320, scatter: { x: -40, y: 120 }, color: '#f5a623' },
  { cx: 360, scatter: { x: 190, y: -40 }, color: '#e879f9' },
]

export default function Problem() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.6,
        },
      })

      tl.fromTo(
        '.problem-title span',
        { y: '110%' },
        { y: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' },
      )
        .fromTo('.problem-map', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5 }, '<0.2')
        // convoy rides together
        .fromTo(
          '.problem-rider',
          { x: -260, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.05, duration: 0.7, ease: 'power1.inOut' },
        )
        // then scatters
        .add('scatter', '+=0.2')
      RIDERS.forEach((r, i) => {
        tl.to(
          `.problem-rider-${i}`,
          { x: r.scatter.x, y: r.scatter.y, duration: 1, ease: 'power2.inOut' },
          'scatter',
        )
      })
      tl.to('.problem-route', { opacity: 0.12, duration: 0.8 }, 'scatter')
        .fromTo(
          '.problem-lost',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, stagger: 0.12, duration: 0.5 },
          'scatter+=0.4',
        )
        .fromTo(
          '.problem-pain',
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, stagger: 0.16, duration: 0.5 },
          'scatter+=0.2',
        )
        .to('.problem-statement', { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="problem" id="problem" ref={rootRef}>
      <div className="problem-sticky">
        <div className="problem-head">
          <p className="kicker">The problem</p>
          <h2 className="h-lg problem-title" aria-label="Group rides are chaotic.">
            <span className="reveal-line"><span>Group rides</span></span>
            <span className="reveal-line"><span>are <em>chaotic.</em></span></span>
          </h2>
        </div>

        <div className="problem-body">
          <div className="problem-map glass" aria-hidden>
            <svg viewBox="0 0 560 360">
              <path
                className="problem-route"
                d="M-20 210 C 120 190 180 220 300 190 C 400 165 480 190 580 160"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
              {RIDERS.map((r, i) => (
                <g key={i} className={`problem-rider problem-rider-${i}`}>
                  <circle cx={r.cx} cy={200 - (r.cx - 200) * 0.18} r="7" fill={r.color} />
                  <circle
                    cx={r.cx}
                    cy={200 - (r.cx - 200) * 0.18}
                    r="13"
                    fill="none"
                    stroke={r.color}
                    strokeOpacity="0.35"
                  />
                </g>
              ))}
              {[
                [92, 108],
                [434, 262],
                [470, 96],
              ].map(([x, y], i) => (
                <g key={i} className="problem-lost" transform={`translate(${x} ${y})`}>
                  <rect x="-52" y="-14" width="104" height="28" rx="14" fill="rgba(10,10,11,0.9)" stroke="rgba(232,35,42,0.5)" />
                  <text x="0" y="4" textAnchor="middle" fill="#e8232a" fontSize="11" letterSpacing="1">
                    SIGNAL LOST
                  </text>
                </g>
              ))}
            </svg>
            <span className="problem-map-tag">A typical Sunday ride · 5 riders · 0 sync</span>
          </div>

          <ul className="problem-list">
            {PAINS.map((p) => (
              <li key={p.title} className="problem-pain">
                <span className="problem-pain-x">✕</span>
                <div>
                  <strong>{p.title}</strong>
                  <small>{p.sub}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="problem-statement lead">
          Riding together shouldn't mean riding alone the moment the road splits.
        </p>
      </div>
    </section>
  )
}
