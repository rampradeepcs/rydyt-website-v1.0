import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageSquareText, CalendarRange, Bike, LineChart, Home } from 'lucide-react'
import './features.css'
import { asset } from '../lib/asset'

gsap.registerPlugin(ScrollTrigger)

const PANELS = [
  {
    icon: Home,
    tag: 'Command center',
    title: 'One home for every ride',
    sub: 'Quick actions, upcoming rides and bike logs — the whole day before you touch the starter.',
    media: { type: 'img', src: asset('/assets/app-home.png'), alt: 'RYDYT home dashboard screen' },
  },
  {
    icon: MessageSquareText,
    tag: 'Crew chat',
    title: 'Talk without stopping',
    sub: 'Group chats per ride, per clan, per city. Voice notes that read themselves out at speed.',
    media: { type: 'img', src: asset('/assets/app-chat.png'), alt: 'RYDYT chat screen with ride groups' },
  },
  {
    icon: CalendarRange,
    tag: 'Events',
    title: 'Find your next horizon',
    sub: 'Track days, breakfast runs, mountain expeditions — discover, book and roll.',
    media: { type: 'img', src: asset('/assets/app-events.png'), alt: 'RYDYT events discovery screen' },
  },
  {
    icon: Bike,
    tag: 'Garage',
    title: 'Your machines, remembered',
    sub: 'Every bike, every service, every document. The garage keeps the paperwork so you keep riding.',
    media: { type: 'img', src: asset('/assets/app-garage.png'), alt: 'RYDYT garage screen with a Royal Enfield Himalayan' },
  },
  {
    icon: LineChart,
    tag: 'Ride analytics',
    title: 'The ride, replayed',
    sub: 'Distance, speed bands, elevation and route — every ride becomes a story worth sharing.',
    media: { type: 'video', src: asset('/assets/ride-summary.mp4'), alt: 'Animated ride summary statistics' },
  },
]

export default function Features() {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const getX = () => -(track.scrollWidth - window.innerWidth)

      const scrollTween = gsap.to(track, {
        x: getX,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      gsap.utils.toArray<HTMLElement>('.feature-phone').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60 },
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="features" id="features" ref={rootRef}>
      <div className="features-sticky">
        <div className="features-headline">
          <p className="kicker">Inside the app</p>
          <h2 className="h-lg">
            Built for the <span className="accent">whole ride.</span>
          </h2>
          <span className="features-hint">Keep scrolling →</span>
        </div>

        <div className="features-track" ref={trackRef}>
          {PANELS.map((p, i) => (
            <article className="feature-panel" key={p.tag}>
              <div className="feature-copy">
                <span className="feature-num">0{i + 1}</span>
                <span className="feature-tag">
                  <p.icon size={13} strokeWidth={2} /> {p.tag}
                </span>
                <h3>{p.title}</h3>
                <p>{p.sub}</p>
              </div>
              <div className="feature-phone" data-cursor="hover">
                <div className="feature-phone-glow" />
                {p.media.type === 'video' ? (
                  <video
                    src={p.media.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label={p.media.alt}
                  />
                ) : (
                  <img src={p.media.src} alt={p.media.alt} loading="lazy" draggable={false} />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
