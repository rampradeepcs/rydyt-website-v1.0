import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './intro.css'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

const LABELS = [
  { text: 'Quick actions', pos: 'intro-label-a' },
  { text: 'Upcoming rides', pos: 'intro-label-b' },
  { text: 'Live route preview', pos: 'intro-label-c' },
  { text: 'One-tap join', pos: 'intro-label-d' },
]

export default function Intro() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
        },
      })

      tl.fromTo('.intro-word span', { y: '125%' }, { y: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' })
        // phone powers on from darkness
        .fromTo(
          '.intro-phone',
          { opacity: 0, scale: 0.82, filter: 'brightness(0.05) blur(6px)' },
          { opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)', duration: 1.4, ease: 'power2.out' },
          '<0.3',
        )
        .fromTo('.intro-glow', { opacity: 0 }, { opacity: 1, duration: 1 }, '<0.4')
        .fromTo(
          '.intro-label',
          { opacity: 0, scale: 0.9, y: 12 },
          { opacity: 1, scale: 1, y: 0, stagger: 0.18, duration: 0.5 },
          '-=0.5',
        )
        .fromTo('.intro-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .to('.intro-phone', { y: -30, duration: 1, ease: 'none' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="intro" id="intro" ref={rootRef}>
      <div className="intro-sticky">
        <div className="intro-bg" aria-hidden />
        <h2 className="intro-word" aria-label="Introducing RYDYT">
          <span className="reveal-line"><span>Introducing</span></span>
          <span className="reveal-line"><span className="intro-brand">RYDYT</span></span>
        </h2>

        <div className="intro-stage">
          <div className="intro-glow" aria-hidden />
          <img
            className="intro-phone"
            src={asset('/assets/app-home.png')}
            alt="RYDYT home screen with quick actions and upcoming rides"
            loading="lazy"
            draggable={false}
          />
          {LABELS.map((l) => (
            <div key={l.text} className={`intro-label glass ${l.pos}`}>
              <span />
              {l.text}
            </div>
          ))}
        </div>

        <p className="intro-sub lead">
          Every ride, every rider, every signal — alive on one dashboard.
        </p>
      </div>
    </section>
  )
}
