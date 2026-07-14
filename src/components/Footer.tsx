import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Compass } from 'lucide-react'
import LogoMark from './LogoMark'
import './footer.css'

const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/rydyt.app/',
    path: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.3 5.6a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Rydyt/61566262581673/',
    path: 'M13.4 22v-8.1h2.72l.41-3.16H13.4V8.72c0-.91.25-1.53 1.56-1.53h1.67V4.36c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.05 1.47-4.05 4.16v2.34H7.42v3.16h2.73V22h3.25Z',
  },
  {
    name: 'X',
    href: 'https://x.com/rydytapp',
    path: 'M17.5 3h3.1l-6.8 7.8L21.8 21h-6.3l-4.9-6.4L5 21H1.9l7.3-8.3L2.2 3h6.4l4.4 5.9Zm-1.1 16.1h1.7L6.9 4.8H5.1Z',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/rydyt',
    path: 'M6.94 5.5a2.19 2.19 0 1 1-4.38 0 2.19 2.19 0 0 1 4.38 0ZM2.83 8.62h3.85V21H2.83V8.62Zm6.34 0h3.69v1.69h.05c.51-.97 1.77-2 3.64-2 3.9 0 4.62 2.57 4.62 5.9V21h-3.85v-6.1c0-1.46-.03-3.33-2.03-3.33-2.03 0-2.34 1.58-2.34 3.22V21H9.17V8.62Z',
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
    links: ['Clans', 'Events', 'Routes', { label: 'Stories', href: 'blog.html' }],
  },
  {
    title: 'Company',
    links: ['About', { label: 'Blog', href: 'blog.html' }, 'Careers', 'Contact'],
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
              <a
                key={s.name}
                className="footer-social"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                aria-label={s.name}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <nav className="footer-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            {col.links.map((l) =>
              typeof l === 'string' ? (
                <a key={l} href="#top" data-cursor="hover" onClick={(e) => e.preventDefault()}>
                  {l}
                </a>
              ) : (
                <a key={l.label} href={l.href} data-cursor="hover">
                  {l.label}
                </a>
              ),
            )}
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
        <span className="footer-legal">
          <a href="privacy.html" data-cursor="hover">Privacy Policy</a>
          <i>·</i>
          <a href="terms.html" data-cursor="hover">Terms &amp; Conditions</a>
        </span>
      </div>
    </footer>
  )
}
