// components/designer/ProductMockups.tsx
// SVG mockups avec couleur dynamique — drop-in pour le designer

import React from 'react'

interface MockupProps {
  color: string
  className?: string
}

/* ─── T-SHIRT ─────────────────────────────────────────────────────────────── */
export function TshirtMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ts-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
        <linearGradient id="ts-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d="M100 80 L60 160 L110 175 L110 390 L290 390 L290 175 L340 160 L300 80
           C280 90 260 105 200 105 C140 105 120 90 100 80Z"
        fill={color}
        filter="url(#ts-shadow)"
      />
      {/* Left sleeve */}
      <path d="M100 80 L40 100 L60 160 L110 145Z" fill={color} />
      {/* Right sleeve */}
      <path d="M300 80 L360 100 L340 160 L290 145Z" fill={color} />
      {/* Collar */}
      <path
        d="M160 82 Q200 118 240 82"
        fill="none" stroke={shadeColor(color, -15)} strokeWidth="2.5"
      />
      {/* Highlight overlay */}
      <path
        d="M100 80 L60 160 L110 175 L110 390 L290 390 L290 175 L340 160 L300 80
           C280 90 260 105 200 105 C140 105 120 90 100 80Z"
        fill="url(#ts-light)"
      />
      {/* Left sleeve highlight */}
      <path d="M100 80 L40 100 L60 160 L110 145Z" fill="url(#ts-light)" />
      {/* Right sleeve highlight */}
      <path d="M300 80 L360 100 L340 160 L290 145Z" fill="url(#ts-light)" />
      {/* Side seams */}
      <line x1="110" y1="175" x2="110" y2="390" stroke={shadeColor(color, -20)} strokeWidth="1.5" opacity="0.4" />
      <line x1="290" y1="175" x2="290" y2="390" stroke={shadeColor(color, -20)} strokeWidth="1.5" opacity="0.4" />
    </svg>
  )
}

/* ─── POLO ────────────────────────────────────────────────────────────────── */
export function PoloMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="po-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
        <linearGradient id="po-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d="M105 95 L65 165 L112 178 L112 390 L288 390 L288 178 L335 165 L295 95
           C275 108 255 118 200 118 C145 118 125 108 105 95Z"
        fill={color}
        filter="url(#po-shadow)"
      />
      {/* Left sleeve */}
      <path d="M105 95 L42 112 L65 165 L112 150Z" fill={color} />
      {/* Right sleeve */}
      <path d="M295 95 L358 112 L335 165 L288 150Z" fill={color} />
      {/* Polo collar — ribbed */}
      <rect x="168" y="82" width="64" height="36" rx="4" fill={shadeColor(color, -12)} />
      <line x1="176" y1="86" x2="176" y2="114" stroke={shadeColor(color, -25)} strokeWidth="1" opacity="0.5" />
      <line x1="184" y1="86" x2="184" y2="114" stroke={shadeColor(color, -25)} strokeWidth="1" opacity="0.5" />
      <line x1="192" y1="86" x2="192" y2="114" stroke={shadeColor(color, -25)} strokeWidth="1" opacity="0.5" />
      <line x1="200" y1="86" x2="200" y2="114" stroke={shadeColor(color, -25)} strokeWidth="1" opacity="0.5" />
      <line x1="208" y1="86" x2="208" y2="114" stroke={shadeColor(color, -25)} strokeWidth="1" opacity="0.5" />
      <line x1="216" y1="86" x2="216" y2="114" stroke={shadeColor(color, -25)} strokeWidth="1" opacity="0.5" />
      <line x1="224" y1="86" x2="224" y2="114" stroke={shadeColor(color, -25)} strokeWidth="1" opacity="0.5" />
      {/* Placket */}
      <rect x="196" y="118" width="8" height="50" rx="2" fill={shadeColor(color, -10)} />
      {/* Buttons */}
      <circle cx="200" cy="128" r="3" fill={shadeColor(color, -30)} />
      <circle cx="200" cy="142" r="3" fill={shadeColor(color, -30)} />
      <circle cx="200" cy="156" r="3" fill={shadeColor(color, -30)} />
      {/* Highlight */}
      <path
        d="M105 95 L65 165 L112 178 L112 390 L288 390 L288 178 L335 165 L295 95
           C275 108 255 118 200 118 C145 118 125 108 105 95Z"
        fill="url(#po-light)"
      />
      <path d="M105 95 L42 112 L65 165 L112 150Z" fill="url(#po-light)" />
      <path d="M295 95 L358 112 L335 165 L288 150Z" fill="url(#po-light)" />
    </svg>
  )
}

/* ─── GILET DE TRAVAIL ───────────────────────────────────────────────────── */
export function GiletMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="gi-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
        <linearGradient id="gi-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Body — sans manches */}
      <path
        d="M130 80 L95 140 L120 390 L280 390 L305 140 L270 80
           C255 92 230 100 200 100 C170 100 145 92 130 80Z"
        fill={color}
        filter="url(#gi-shadow)"
      />
      {/* Shoulder straps */}
      <path d="M130 80 L108 80 L95 140 L130 130Z" fill={shadeColor(color, -8)} />
      <path d="M270 80 L292 80 L305 140 L270 130Z" fill={shadeColor(color, -8)} />
      {/* V-neck */}
      <path d="M155 85 L200 145 L245 85" fill="none" stroke={shadeColor(color, -20)} strokeWidth="2" />
      {/* Zip */}
      <rect x="197" y="145" width="6" height="200" rx="2" fill={shadeColor(color, -25)} opacity="0.7" />
      <rect x="193" y="155" width="14" height="8" rx="2" fill={shadeColor(color, -35)} />
      {/* Left chest pocket */}
      <rect x="138" y="160" width="48" height="36" rx="4" fill="none" stroke={shadeColor(color, -20)} strokeWidth="1.5" />
      <line x1="138" y1="172" x2="186" y2="172" stroke={shadeColor(color, -20)} strokeWidth="1" />
      {/* Right chest pocket */}
      <rect x="214" y="160" width="48" height="36" rx="4" fill="none" stroke={shadeColor(color, -20)} strokeWidth="1.5" />
      <line x1="214" y1="172" x2="262" y2="172" stroke={shadeColor(color, -20)} strokeWidth="1" />
      {/* Lower pockets */}
      <rect x="126" y="270" width="64" height="60" rx="4" fill="none" stroke={shadeColor(color, -20)} strokeWidth="1.5" />
      <rect x="210" y="270" width="64" height="60" rx="4" fill="none" stroke={shadeColor(color, -20)} strokeWidth="1.5" />
      {/* Highlight */}
      <path
        d="M130 80 L95 140 L120 390 L280 390 L305 140 L270 80
           C255 92 230 100 200 100 C170 100 145 92 130 80Z"
        fill="url(#gi-light)"
      />
    </svg>
  )
}

/* ─── CASQUETTE ───────────────────────────────────────────────────────────── */
export function CasquetteMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 320" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ca-shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <linearGradient id="ca-light" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="ca-brim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={shadeColor(color, -10)} />
          <stop offset="100%" stopColor={shadeColor(color, -30)} />
        </linearGradient>
      </defs>

      {/* Crown */}
      <path
        d="M80 200 Q80 60 200 50 Q320 60 320 200Z"
        fill={color}
        filter="url(#ca-shadow)"
      />
      {/* Panel seams */}
      <line x1="200" y1="52" x2="200" y2="200" stroke={shadeColor(color, -18)} strokeWidth="1.5" opacity="0.6" />
      <path d="M140 65 Q158 180 180 200" fill="none" stroke={shadeColor(color, -18)} strokeWidth="1.5" opacity="0.4" />
      <path d="M260 65 Q242 180 220 200" fill="none" stroke={shadeColor(color, -18)} strokeWidth="1.5" opacity="0.4" />
      {/* Brim */}
      <path
        d="M80 200 Q140 230 200 228 Q260 230 320 200 L310 215 Q260 248 200 246 Q140 248 90 215Z"
        fill="url(#ca-brim)"
      />
      {/* Sweatband base */}
      <path d="M80 200 Q200 212 320 200 L320 208 Q200 220 80 208Z" fill={shadeColor(color, -25)} opacity="0.5" />
      {/* Button top */}
      <circle cx="200" cy="55" r="8" fill={shadeColor(color, -20)} />
      <circle cx="200" cy="55" r="4" fill={shadeColor(color, -35)} />
      {/* Adjustable strap back hint */}
      <rect x="170" y="195" width="60" height="10" rx="5" fill={shadeColor(color, -30)} opacity="0.5" />
      {/* Highlight */}
      <path
        d="M80 200 Q80 60 200 50 Q320 60 320 200Z"
        fill="url(#ca-light)"
      />
    </svg>
  )
}

/* ─── TOTEBAG ─────────────────────────────────────────────────────────────── */
export function TotebagMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="tb-shadow">
          <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000" floodOpacity="0.13" />
        </filter>
        <linearGradient id="tb-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Handles */}
      <path d="M145 120 Q145 60 175 55 Q200 52 200 52 Q200 52 225 55 Q255 60 255 120"
        fill="none" stroke={shadeColor(color, -25)} strokeWidth="12" strokeLinecap="round" />

      {/* Bag body */}
      <rect x="80" y="115" width="240" height="280" rx="10" fill={color} filter="url(#tb-shadow)" />

      {/* Side gusset lines */}
      <line x1="80" y1="115" x2="80" y2="395" stroke={shadeColor(color, -18)} strokeWidth="1.5" opacity="0.4" />
      <line x1="320" y1="115" x2="320" y2="395" stroke={shadeColor(color, -18)} strokeWidth="1.5" opacity="0.4" />

      {/* Bottom fold */}
      <line x1="80" y1="375" x2="320" y2="375" stroke={shadeColor(color, -18)} strokeWidth="1.5" opacity="0.35" />

      {/* Top hem */}
      <rect x="80" y="115" width="240" height="18" rx="4" fill={shadeColor(color, -12)} opacity="0.5" />

      {/* Highlight */}
      <rect x="80" y="115" width="240" height="280" rx="10" fill="url(#tb-light)" />

      {/* Stitch marks along handles */}
      <path d="M145 120 Q145 60 175 55 Q200 52 225 55 Q255 60 255 120"
        fill="none" stroke={shadeColor(color, -40)} strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
    </svg>
  )
}

/* ─── SWEAT ───────────────────────────────────────────────────────────────── */
export function SweatMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sw-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
        <linearGradient id="sw-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.09" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d="M95 90 L38 120 L58 185 L108 165 L108 390 L292 390 L292 165 L342 185 L362 120 L305 90
           C282 106 255 118 200 118 C145 118 118 106 95 90Z"
        fill={color}
        filter="url(#sw-shadow)"
      />
      {/* Left sleeve */}
      <path d="M95 90 L38 120 L58 185 L108 165 L108 130Z" fill={color} />
      {/* Right sleeve */}
      <path d="M305 90 L362 120 L342 185 L292 165 L292 130Z" fill={color} />
      {/* Ribbed collar */}
      <path d="M155 88 Q200 122 245 88" fill="none" stroke={shadeColor(color, -18)} strokeWidth="4" strokeLinecap="round" />
      {/* Ribbed cuffs left */}
      <path d="M40 179 Q48 183 58 185" fill="none" stroke={shadeColor(color, -22)} strokeWidth="4" strokeLinecap="round" />
      {/* Ribbed cuffs right */}
      <path d="M360 179 Q352 183 342 185" fill="none" stroke={shadeColor(color, -22)} strokeWidth="4" strokeLinecap="round" />
      {/* Ribbed hem */}
      <rect x="108" y="374" width="184" height="16" rx="3" fill={shadeColor(color, -12)} opacity="0.5" />
      {/* Kangaroo pocket */}
      <path d="M148 280 L148 340 Q200 350 252 340 L252 280Z" fill="none" stroke={shadeColor(color, -20)} strokeWidth="1.5" />
      {/* Highlight */}
      <path
        d="M95 90 L38 120 L58 185 L108 165 L108 390 L292 390 L292 165 L342 185 L362 120 L305 90
           C282 106 255 118 200 118 C145 118 118 106 95 90Z"
        fill="url(#sw-light)"
      />
    </svg>
  )
}

/* ─── TABLIER ─────────────────────────────────────────────────────────────── */
export function TablierMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 480" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="ta-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.13" />
        </filter>
        <linearGradient id="ta-light" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Neck strap */}
      <path d="M165 70 Q200 55 235 70" fill="none" stroke={shadeColor(color, -20)} strokeWidth="10" strokeLinecap="round" />

      {/* Bib (upper part) */}
      <rect x="148" y="70" width="104" height="110" rx="6" fill={color} filter="url(#ta-shadow)" />

      {/* Waist straps */}
      <path d="M148 180 L60 175 L58 185 L148 192Z" fill={shadeColor(color, -15)} />
      <path d="M252 180 L340 175 L342 185 L252 192Z" fill={shadeColor(color, -15)} />

      {/* Main apron skirt */}
      <rect x="100" y="185" width="200" height="240" rx="8" fill={color} />

      {/* Chest pocket */}
      <rect x="166" y="100" width="68" height="52" rx="4" fill="none" stroke={shadeColor(color, -22)} strokeWidth="1.5" />
      <line x1="166" y1="116" x2="234" y2="116" stroke={shadeColor(color, -22)} strokeWidth="1" />

      {/* Side pocket */}
      <rect x="112" y="270" width="72" height="64" rx="4" fill="none" stroke={shadeColor(color, -22)} strokeWidth="1.5" />

      {/* Bottom hem */}
      <line x1="100" y1="408" x2="300" y2="408" stroke={shadeColor(color, -18)} strokeWidth="2" opacity="0.4" />

      {/* Highlight */}
      <rect x="148" y="70" width="104" height="110" rx="6" fill="url(#ta-light)" />
      <rect x="100" y="185" width="200" height="240" rx="8" fill="url(#ta-light)" />
    </svg>
  )
}

/* ─── GILET SÉCURITÉ ─────────────────────────────────────────────────────── */
export function GiletSecuriteMockup({ color, className = '' }: MockupProps) {
  return (
    <svg viewBox="0 0 400 440" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="gs-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Body */}
      <path
        d="M125 85 L92 145 L118 390 L282 390 L308 145 L275 85
           C258 96 232 104 200 104 C168 104 142 96 125 85Z"
        fill={color}
        filter="url(#gs-shadow)"
      />
      {/* Shoulder */}
      <path d="M125 85 L104 85 L92 145 L125 135Z" fill={shadeColor(color, -8)} />
      <path d="M275 85 L296 85 L308 145 L275 135Z" fill={shadeColor(color, -8)} />

      {/* Reflective stripes — horizontal */}
      <rect x="118" y="200" width="164" height="16" rx="3" fill="#f5f5f5" opacity="0.85" />
      <rect x="118" y="220" width="164" height="5" rx="2" fill="#e8e800" opacity="0.7" />
      <rect x="118" y="290" width="164" height="16" rx="3" fill="#f5f5f5" opacity="0.85" />
      <rect x="118" y="310" width="164" height="5" rx="2" fill="#e8e800" opacity="0.7" />

      {/* V-neck */}
      <path d="M152 88 L200 140 L248 88" fill="none" stroke={shadeColor(color, -22)} strokeWidth="2" />

      {/* Front zip */}
      <rect x="197" y="140" width="6" height="180" rx="2" fill={shadeColor(color, -28)} opacity="0.6" />

      {/* Chest pockets */}
      <rect x="130" y="150" width="54" height="36" rx="3" fill="none" stroke={shadeColor(color, -20)} strokeWidth="1.5" />
      <rect x="216" y="150" width="54" height="36" rx="3" fill="none" stroke={shadeColor(color, -20)} strokeWidth="1.5" />
    </svg>
  )
}

/* ─── MAP id → composant ──────────────────────────────────────────────────── */
export const MOCKUP_MAP: Record<string, React.FC<MockupProps>> = {
  tshirt:        TshirtMockup,
  polo:          PoloMockup,
  gilet:         GiletMockup,
  casquette:     CasquetteMockup,
  totebag:       TotebagMockup,
  sweat:         SweatMockup,
  tablier:       TablierMockup,
  gilet_securite: GiletSecuriteMockup,
}

/* ─── Util : assombrir / éclaircir une couleur hex ──────────────────────── */
export function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent))
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}
