import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play } from 'lucide-react'

/* App Store glyph: the "A" mark inside a circle, in lucide's stroke style */
const AppStoreIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="9.2" />
    <path d="M8.4 15.8 12 8.4l3.6 7.4" />
    <path d="M9.2 13.6h5.6" />
  </svg>
)
import MagneticButton from './MagneticButton'
import Particles from './Particles'
import { openBetaModal } from './BetaModal'
import './downloadcta.css'
import { asset } from '../lib/asset'

const APP_STORE_URL = 'https://apps.apple.com/in/app/rydyt/id6575364023'
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.moaiconsulting.rydyt&pcampaignid=web_share'

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
        { y: '125%' },
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
            <MagneticButton onClick={openBetaModal}>Join Early Access</MagneticButton>
            <div className="cta-stores">
              <a
                className="cta-store glass"
                data-cursor="hover"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppStoreIcon size={16} /> App Store
              </a>
              <a
                className="cta-store glass"
                data-cursor="hover"
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play size={15} /> Google Play
              </a>
            </div>
          </div>
        </div>

        <div className="cta-phone">
          <div className="cta-phone-glow" />
          <img
            src={asset('/assets/download-banner.webp')}
            alt="RYDYT app home screen on a phone"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>
    </section>
  )
}
