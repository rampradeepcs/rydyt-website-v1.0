import { useRef, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import { Quote } from 'lucide-react'
import { asset } from '../lib/asset'
import './community.css'

const EASE = [0.16, 1, 0.3, 1] as const

const RIDERS = [
  {
    name: 'Rampradeep',
    role: 'Gandhinagar',
    quote:
      "Planning group rides used to be a headache. With Rydyt's event features, it's become a breeze. Our club's attendance has soared since we started using it!",
    img: '/assets/riders/rampradeep.png',
  },
  {
    name: 'Arjun Singh',
    role: 'Hyderabad',
    quote:
      "Rydyt turned my daily commute into a fun challenge. Competing on leaderboards with fellow city riders adds excitement to my routine. It's made me a more engaged rider!",
    img: '/assets/riders/arjun_singh.jpg',
  },
  {
    name: 'Vikram James',
    role: 'Hyderabad',
    quote:
      "As a new rider, Rydyt's community has been incredibly welcoming. The app's features have boosted my confidence and skills. It's like having a mentor on every ride!",
    img: '/assets/riders/vikram_james.jpg',
  },
  {
    name: 'David Dawson',
    role: 'Hyderabad',
    quote:
      "Rydyt's Ride Mode is a lifesaver on long trips. Easy navigation and quick access to SOS have made my tours safer and more enjoyable. Can't imagine riding without it now!",
    img: '/assets/riders/david_dawson.jpg',
  },
  {
    name: 'Shivaji Rao',
    role: 'Hyderabad',
    quote:
      "Rydyt's chat feature connected me with riders who share my passion. Now, I always have a crew ready for impromptu rides. It's more than an app - it's a riding community!",
    img: '/assets/riders/shivaji.jpg',
  },
  {
    name: 'Premson R',
    role: 'Hyderabad',
    quote:
      "Rydyt's ride tracking and maintenance logs keep me on top of my bike's health. Plus, the events feature helped me discover local meetups. It's a must-have for any serious rider!",
    img: '/assets/riders/premson_r.jpg',
  },
  {
    name: 'Kartik Lanka',
    role: 'Hyderabad',
    quote:
      "As a group ride organizer, Rydyt is a game-changer. Planning routes, tracking riders, and staying connected has never been easier. It's become our club's go-to app!",
    img: '/assets/riders/kartik_l.jpg',
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
          <img
            className="community-avatar"
            src={asset(r.img)}
            alt={`${r.name}, RYDYT rider from ${r.role}`}
            loading="lazy"
            draggable={false}
          />
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
