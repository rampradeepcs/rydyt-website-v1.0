import { type ReactNode, type MouseEvent } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'
import { scrollToTarget } from '../hooks/useSmoothScroll'

type Props = {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
  href?: string
  onClick?: () => void
}

export default function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  href,
  onClick,
}: Props) {
  const ref = useMagnetic<HTMLButtonElement>(0.3)

  const spawnRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget
    const r = btn.getBoundingClientRect()
    const d = Math.max(r.width, r.height)
    const span = document.createElement('span')
    span.className = 'ripple'
    span.style.width = span.style.height = `${d}px`
    span.style.left = `${e.clientX - r.left - d / 2}px`
    span.style.top = `${e.clientY - r.top - d / 2}px`
    btn.appendChild(span)
    setTimeout(() => span.remove(), 700)
  }

  return (
    <button
      ref={ref}
      data-cursor="hover"
      className={`btn btn-${variant} ${className}`}
      onClick={(e) => {
        spawnRipple(e)
        if (href) scrollToTarget(href)
        onClick?.()
      }}
    >
      {children}
    </button>
  )
}
