import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Apple, Play } from 'lucide-react'
import MagneticButton from './MagneticButton'
import Particles from './Particles'
import './downloadcta.css'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

export default function DownloadCTA() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-phone',
        { y: 160, rotate: 4 },
        {
          y: 0,
          rotate: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 0.6,
          },
        },
      )
      gsap.fromTo(
        '.cta-title span',
        { y: '110%' },
        {
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 60%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="cta" id="download" ref={rootRef}>
      <div className="cta-bg" aria-hidden>
        <div className="cta-glow" />
        <Particles density={50} />
      </div>

      <div className="cta-inner">
        <div className="cta-copy">
          <p className="kicker">Early access</p>
          <h2 className="cta-title" aria-label="Your next ride begins here.">
            <span className="reveal-line"><span>Your next ride</span></span>
            <span className="reveal-line"><span>begins <em>here.</em></span></span>
          </h2>
          <p className="lead">
            Join the beta and put the whole crew on the same road. iOS and
            Android, free while in early access.
          </p>
          <div className="cta-actions">
            <MagneticButton>Join Early Access</MagneticButton>
            <div className="cta-stores">
              <span className="cta-store glass" data-cursor="hover">
                <Apple size={16} /> App Store
              </span>
              <span className="cta-store glass" data-cursor="hover">
                <Play size={15} /> Google Play
              </span>
            </div>
          </div>
        </div>

        <div className="cta-phone">
          <div className="cta-phone-glow" />
          <img
            src={asset('/assets/download-banner.png')}
            alt="RYDYT app home screen on a phone"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}
