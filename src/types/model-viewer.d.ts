import type React from 'react'

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        'camera-orbit'?: string
        'field-of-view'?: string
        exposure?: string
        'shadow-intensity'?: string
        'interaction-prompt'?: string
        'disable-zoom'?: boolean
        'disable-pan'?: boolean
        'disable-tap'?: boolean
        loading?: string
        reveal?: string
      }
    }
  }
}

export {}
