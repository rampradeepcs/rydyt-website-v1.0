import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './stats.css'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 1.2, decimals: 1, suffix: 'M', label: 'Kilometres tracked' },
  { value: 48, decimals: 0, suffix: 'K', label: 'Rides completed' },
  { value: 320, decimals: 0, suffix: '+', label: 'Riding communities' },
  { value: 12, decimals: 0, suffix: '', label: 'Countries riding' },
  { value: 8.6, decimals: 1, suffix: 'K', label: 'Curated routes' },
]

export default function Stats() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stat-value').forEach((el, i) => {
        const target = STATS[i]
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target.value,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(target.decimals) + target.suffix
          },
        })
      })
      gsap.fromTo(
        '.stat',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section stats" ref={rootRef}>
      <div className="stats-row">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <span className="stat-value">0{s.suffix}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
