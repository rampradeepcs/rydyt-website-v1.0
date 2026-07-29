import { useEffect, useRef, type VideoHTMLAttributes } from 'react'

/**
 * A muted looping video that stays un-downloaded (preload="none") until it
 * scrolls near the viewport, then starts playing. Pauses again off-screen.
 */
export default function LazyVideo(props: VideoHTMLAttributes<HTMLVideoElement>) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current!
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <video ref={ref} muted loop playsInline preload="none" {...props} />
}
