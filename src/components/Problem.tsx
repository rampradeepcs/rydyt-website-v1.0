import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPinOff, MicOff, Fuel, CloudRain, Siren } from 'lucide-react'
import { asset } from '../lib/asset'
import './problem.css'

gsap.registerPlugin(ScrollTrigger)

const PAINS = [
  { title: 'Riders get lost', sub: 'One wrong exit and the group splits', icon: MapPinOff },
  { title: 'Comms break down', sub: 'Hand signals die past 60 km/h', icon: MicOff },
  { title: 'Fuel runs dry', sub: 'Nobody plans the stops', icon: Fuel },
  { title: 'Weather surprises', sub: 'Rain hits half the convoy', icon: CloudRain },
  { title: 'Emergencies go unseen', sub: 'A crash at the back, noticed 20 km later', icon: Siren },
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
        // route draws itself, waypoints pop in
        .to('.problem-route', { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut' }, '<0.3')
        .fromTo(
          '.problem-wp-inner',
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, stagger: 0.18, duration: 0.4, ease: 'back.out(2.2)' },
          '<0.15',
        )
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
          { x: r.scatter.x * 1.4, y: r.scatter.y * 1.4, duration: 1, ease: 'power2.inOut' },
          'scatter',
        )
      })
      tl.to('.problem-route', { opacity: 0.28, duration: 0.8 }, 'scatter')
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
            <img
              className="problem-map-bg"
              src={asset('/assets/map.png')}
              alt=""
              loading="lazy"
              draggable={false}
            />
            <div className="problem-map-shade" />
            {/* overlay shares the map's own coordinate space (797x652) so the
               route can trace the main road exactly */}
            <svg viewBox="0 0 797 652">
              <path
                className="problem-route"
                d="M30 277 C 140 268 300 290 433 326 C 540 355 630 408 700 462"
                fill="none"
                stroke="#e8232a"
                strokeWidth="4.5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
              />

              {/* start waypoint */}
              <g className="problem-wp" transform="translate(30 277)">
                <g className="problem-wp-inner">
                  <circle r="18" fill="rgba(255,255,255,0.16)" />
                  <circle r="13" fill="#fff" />
                  <text y="4.5" textAnchor="middle" fontSize="12" fontWeight="600" fill="#0a0a0c">
                    A
                  </text>
                  <text y="38" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.78)">
                    Salem
                  </text>
                </g>
              </g>

              {/* mid stop */}
              <g className="problem-wp" transform="translate(433 326)">
                <g className="problem-wp-inner">
                  <circle r="18" fill="rgba(232,35,42,0.22)" />
                  <circle r="13" fill="#e8232a" stroke="rgba(255,255,255,0.85)" strokeWidth="2" />
                  <text y="4" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#fff">
                    L1
                  </text>
                </g>
              </g>

              {/* destination pin */}
              <g className="problem-wp" transform="translate(700 462)">
                <g className="problem-wp-inner">
                  <path
                    d="M0 15 C 0 15 -17 -6 -17 -17 A 17 17 0 1 1 17 -17 C 17 -6 0 15 0 15 Z"
                    fill="#22c55e"
                  />
                  <circle cy="-17" r="5.5" fill="#0a0a0c" fillOpacity="0.85" />
                  <text y="40" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.78)">
                    Vellore
                  </text>
                </g>
              </g>

              {RIDERS.map((r, i) => (
                <g key={i} className={`problem-rider problem-rider-${i}`}>
                  <circle cx={r.cx} cy={272 + (r.cx - 137) * 0.18} r="9" fill={r.color} />
                  <circle
                    cx={r.cx}
                    cy={272 + (r.cx - 137) * 0.18}
                    r="17"
                    fill="none"
                    stroke={r.color}
                    strokeOpacity="0.35"
                  />
                </g>
              ))}
              {[
                [150, 140],
                [620, 240],
                [330, 540],
              ].map(([x, y], i) => (
                <g key={i} className="problem-lost" transform={`translate(${x} ${y})`}>
                  <rect x="-98" y="-19" width="196" height="38" rx="19" fill="rgba(10,10,11,0.9)" stroke="rgba(232,35,42,0.5)" />
                  <text x="0" y="5" textAnchor="middle" fill="#e8232a" fontSize="14" letterSpacing="1.5">
                    RIDER DISCONNECTED
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
                <span className="problem-pain-icon">
                  <p.icon size={17} strokeWidth={1.7} />
                </span>
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
