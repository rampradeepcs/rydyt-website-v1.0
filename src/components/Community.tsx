import { useRef, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import { Quote } from 'lucide-react'
import './community.css'

const EASE = [0.16, 1, 0.3, 1] as const

const RIDERS = [
  {
    name: 'Kushang M.',
    role: 'Clan Riders · Chennai',
    quote: 'We stopped losing people on ghat roads. That alone is worth everything.',
    initials: 'KM',
    hue: 358,
  },
  {
    name: 'Aisha R.',
    role: 'Night Riders · Bangalore',
    quote: 'The intercom feels like the whole crew is inside your helmet.',
    initials: 'AR',
    hue: 210,
  },
  {
    name: 'Venkat S.',
    role: 'Solo tourer · 42 countries',
    quote: 'SOS pinged my group before I even got my gloves off. Unreal.',
    initials: 'VS',
    hue: 84,
  },
  {
    name: 'Uday K.',
    role: 'Weekend breakfast runs',
    quote: 'Ride analytics turned our Sunday loop into a friendly championship.',
    initials: 'UK',
    hue: 38,
  },
]

function TiltCard({ r, i }: { r: (typeof RIDERS)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const tilt = (e: MouseEvent) => {
    const el = ref.current!
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 12}deg) translateY(-6px)`
  }
  const reset = () => {
    ref.current!.style.transform = ''
  }

  return (
    <motion.div
      className="community-card-wrap"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
    >
      <div
        ref={ref}
        className="community-card glass"
        data-cursor="hover"
        onMouseMove={tilt}
        onMouseLeave={reset}
        style={{ animationDelay: `${i * 0.9}s` }}
      >
        <Quote size={18} className="community-quote-mark" />
        <p className="community-quote">{r.quote}</p>
        <div className="community-rider">
          <span
            className="community-avatar"
            style={{ background: `linear-gradient(135deg, hsl(${r.hue} 70% 45%), hsl(${r.hue} 80% 24%))` }}
          >
            {r.initials}
          </span>
          <div>
            <strong>{r.name}</strong>
            <small>{r.role}</small>
          </div>
          <span className="community-wave" aria-hidden>
            {Array.from({ length: 5 }).map((_, j) => (
              <i key={j} style={{ animationDelay: `${j * 0.12}s` }} />
            ))}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Community() {
  return (
    <section className="section community" id="community">
      <div className="community-head">
        <p className="kicker">The community</p>
        <h2 className="h-lg">
          Ridden by <span className="accent">thousands.</span>
        </h2>
        <p className="lead">
          Clans, touring crews and solo wanderers — connected on one network.
        </p>
      </div>
      <div className="community-grid">
        {RIDERS.map((r, i) => (
          <TiltCard r={r} i={i} key={r.name} />
        ))}
      </div>
    </section>
  )
}
