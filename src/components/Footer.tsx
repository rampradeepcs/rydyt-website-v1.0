import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Compass } from 'lucide-react'
import LogoMark from './LogoMark'
import './footer.css'

const SOCIALS = [
  {
    name: 'Instagram',
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.3 5.6a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z',
  },
  {
    name: 'YouTube',
    path: 'M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z',
  },
  {
    name: 'X',
    path: 'M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L2.2 3h6.4l4.4 5.9Zm-1.1 16.1h1.7L6.9 4.8H5.1Z',
  },
]

gsap.registerPlugin(ScrollTrigger)

const COLS = [
  {
    title: 'Product',
    links: ['Features', 'HUD Mode', 'Ride Analytics', 'Early Access'],
  },
  {
    title: 'Community',
    links: ['Clans', 'Events', 'Routes', 'Stories'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact'],
  },
]

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null)
  const compassRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const route = document.querySelector('.footer-route path.footer-route-line') as SVGPathElement | null
      if (route) {
        const len = route.getTotalLength()
        gsap.set(route, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(route, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 90%',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        })
      }
    }, rootRef)

    /* compass needle follows the cursor */
    const compass = compassRef.current
    const move = (e: MouseEvent) => {
      if (!compass) return
      const r = compass.getBoundingClientRect()
      const angle =
        (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) /
          Math.PI +
        90
      compass.style.setProperty('--needle', `${angle}deg`)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      ctx.revert()
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <footer className="footer" ref={rootRef}>
      <svg className="footer-route" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 80 C 180 40 300 100 460 70 C 620 40 700 95 880 65 C 1040 40 1150 90 1440 50"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeDasharray="5 8"
        />
        <path
          className="footer-route-line"
          d="M0 80 C 180 40 300 100 460 70 C 620 40 700 95 880 65 C 1040 40 1150 90 1440 50"
          fill="none"
          stroke="#e8232a"
          strokeWidth="2"
        />
      </svg>

      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <LogoMark />
            <span>RYDYT</span>
          </div>
          <p>Every ride. Every rider. Connected.</p>
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <span key={s.name} className="footer-social" data-cursor="hover" aria-label={s.name}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </span>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <nav className="footer-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            {col.links.map((l) => (
              <a key={l} href="#top" data-cursor="hover" onClick={(e) => e.preventDefault()}>
                {l}
              </a>
            ))}
          </nav>
        ))}

        <div className="footer-compass" aria-hidden>
          <svg ref={compassRef} viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="40"
                y1="7"
                x2="40"
                y2="12"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1.5"
                transform={`rotate(${i * 45} 40 40)`}
              />
            ))}
            <g className="footer-needle">
              <path d="M40 14 L45 42 L40 38 L35 42 Z" fill="#e8232a" />
              <path d="M40 66 L35 42 L40 46 L45 42 Z" fill="rgba(255,255,255,0.4)" />
            </g>
            <circle cx="40" cy="40" r="3" fill="#fff" />
          </svg>
          <span>
            <Compass size={11} /> Find your bearing
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 RYDYT Labs. All rides reserved.</span>
        <span>Privacy · Terms · Safety</span>
      </div>
    </footer>
  )
}
