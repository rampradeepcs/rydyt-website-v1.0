import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './cursor.css'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const dot = dotRef.current!
    document.documentElement.classList.add('has-cursor')

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' })

    const move = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      const target = (e.target as HTMLElement).closest?.('[data-cursor]')
      dot.classList.toggle('is-hover', !!target)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" aria-hidden />
}
