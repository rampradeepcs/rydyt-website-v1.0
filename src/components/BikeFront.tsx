/** Stylized front-facing motorcycle + rider, neon accents. */
export default function BikeFront({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 300" fill="none" aria-hidden>
      <defs>
        <radialGradient id="bf-headlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffd9db" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e8232a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bf-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2a2e" />
          <stop offset="100%" stopColor="#0c0c0e" />
        </linearGradient>
        <linearGradient id="bf-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b0f12" />
          <stop offset="100%" stopColor="#12060a" />
        </linearGradient>
      </defs>

      {/* headlight beam cast on the road */}
      <path className="bf-beam" d="M96 196 L60 300 L180 300 L144 196 Z" fill="url(#bf-headlight)" opacity="0.5" />

      {/* rider helmet */}
      <path d="M92 44 C92 22 104 10 120 10 C136 10 148 22 148 44 L148 58 C148 66 142 72 134 72 L106 72 C98 72 92 66 92 58 Z" fill="url(#bf-body)" stroke="#3a3a3f" strokeWidth="1.5" />
      <path d="M98 44 C98 36 104 30 120 30 C136 30 142 36 142 44 L142 52 C142 56 138 58 134 58 L106 58 C102 58 98 56 98 52 Z" fill="url(#bf-visor)" stroke="#e8232a" strokeOpacity="0.6" strokeWidth="1" />

      {/* shoulders / torso */}
      <path d="M74 96 C80 76 100 68 120 68 C140 68 160 76 166 96 L170 122 L70 122 Z" fill="url(#bf-body)" stroke="#3a3a3f" strokeWidth="1.5" />
      {/* arms to bars */}
      <path d="M74 96 C58 104 46 116 42 130 L58 138 C64 124 74 114 86 108 Z" fill="url(#bf-body)" />
      <path d="M166 96 C182 104 194 116 198 130 L182 138 C176 124 166 114 154 108 Z" fill="url(#bf-body)" />

      {/* mirrors */}
      <line x1="52" y1="120" x2="30" y2="96" stroke="#3a3a3f" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="26" cy="90" rx="10" ry="6" fill="#1a1a1e" stroke="#3a3a3f" strokeWidth="1.5" transform="rotate(-24 26 90)" />
      <line x1="188" y1="120" x2="210" y2="96" stroke="#3a3a3f" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="214" cy="90" rx="10" ry="6" fill="#1a1a1e" stroke="#3a3a3f" strokeWidth="1.5" transform="rotate(24 214 90)" />

      {/* handlebars */}
      <path d="M38 132 C70 118 170 118 202 132" stroke="#2c2c30" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="30" y="124" width="18" height="12" rx="6" fill="#0c0c0e" stroke="#e8232a" strokeOpacity="0.55" strokeWidth="1" />
      <rect x="192" y="124" width="18" height="12" rx="6" fill="#0c0c0e" stroke="#e8232a" strokeOpacity="0.55" strokeWidth="1" />

      {/* windscreen + fairing */}
      <path d="M84 132 C88 118 104 110 120 110 C136 110 152 118 156 132 L160 168 C160 178 150 186 120 186 C90 186 80 178 80 168 Z" fill="url(#bf-body)" stroke="#3a3a3f" strokeWidth="1.5" />
      <path d="M92 134 C96 124 108 118 120 118 C132 118 144 124 148 134 L150 150 L90 150 Z" fill="#101014" stroke="#e8232a" strokeOpacity="0.35" strokeWidth="1" />

      {/* headlight cluster */}
      <ellipse className="bf-lamp" cx="120" cy="164" rx="26" ry="13" fill="#fff" opacity="0.95" />
      <ellipse cx="120" cy="164" rx="34" ry="18" fill="url(#bf-headlight)" opacity="0.9" />
      {/* DRL strips */}
      <path d="M88 158 L100 172" stroke="#e8232a" strokeWidth="3" strokeLinecap="round" className="bf-drl" />
      <path d="M152 158 L140 172" stroke="#e8232a" strokeWidth="3" strokeLinecap="round" className="bf-drl" />

      {/* fork */}
      <rect x="98" y="186" width="8" height="46" rx="4" fill="#26262a" />
      <rect x="134" y="186" width="8" height="46" rx="4" fill="#26262a" />

      {/* fender */}
      <path d="M88 216 C92 204 148 204 152 216 L148 230 L92 230 Z" fill="url(#bf-body)" stroke="#3a3a3f" strokeWidth="1.5" />

      {/* front wheel with neon rim */}
      <ellipse cx="120" cy="258" rx="30" ry="38" fill="#0a0a0c" />
      <ellipse cx="120" cy="258" rx="30" ry="38" fill="none" stroke="#e8232a" strokeWidth="2.5" className="bf-rim" />
      <ellipse cx="120" cy="258" rx="18" ry="24" fill="none" stroke="#2c2c30" strokeWidth="2" />
      <ellipse cx="120" cy="258" rx="5" ry="7" fill="#3a3a3f" />
    </svg>
  )
}
