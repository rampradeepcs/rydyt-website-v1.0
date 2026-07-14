import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __rydytLenis?: Lenis
  }
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/** Scroll to an element/selector, via Lenis when it is active. */
export function scrollToTarget(target: string | number) {
  if (window.__rydytLenis) {
    window.__rydytLenis.scrollTo(target, { duration: 1.8, easing: easeOutExpo })
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}

/** Lenis smooth scroll wired into GSAP ScrollTrigger. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // expose for anchor navigation (Lenis owns the scroll position)
    window.__rydytLenis = lenis

    // deep links: #features etc. scroll through Lenis
    const onHash = () => {
      if (location.hash)
        lenis.scrollTo(location.hash, { duration: 1.8, easing: easeOutExpo })
    }
    window.addEventListener('hashchange', onHash)
    onHash()

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      window.removeEventListener('hashchange', onHash)
      lenis.destroy()
      delete window.__rydytLenis
    }
  }, [enabled])
}
