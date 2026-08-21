// Petits composants UI partagés par l'espace /jarvis — thème sombre "verre liquide".
'use client'
import { CSSProperties, ReactNode } from 'react'

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="liquid-glass-panel"
      style={{
        borderRadius: 18,
        padding: 16,
        border: '1px solid rgba(255,255,255,0.08)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.3, textTransform: 'uppercase' }}>
        {children}
      </h2>
      {action}
    </div>
  )
}

export function Pill({ children, color = '#22D3EE' }: { children: ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: 20,
      fontSize: 10.5, fontWeight: 700, color,
      background: `${color}22`, border: `1px solid ${color}40`,
    }}>
      {children}
    </span>
  )
}

export function Button({ children, onClick, variant = 'primary', type = 'button', disabled, style }: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
  style?: CSSProperties
}) {
  const base: CSSProperties = {
    padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.15s, transform 0.1s',
  }
  const variants: Record<string, CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, #22D3EE, #8B5CF6)', color: '#05070C' },
    ghost: { background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' },
    danger: { background: 'rgba(239,68,68,0.14)', color: '#F87171', border: '1px solid rgba(239,68,68,0.3)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

const fieldStyle: CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  color: '#fff', fontSize: 13, outline: 'none',
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...fieldStyle, ...props.style }} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...fieldStyle, resize: 'vertical', fontFamily: 'inherit', ...props.style }} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...fieldStyle, ...props.style }} />
}

export function ProgressBar({ value, color = '#22D3EE' }: { value: number; color?: string }) {
  return (
    <div style={{ width: '100%', height: 6, borderRadius: 20, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.max(0, Math.min(100, value))}%`, height: '100%',
        background: `linear-gradient(90deg, ${color}, #8B5CF6)`, borderRadius: 20, transition: 'width 0.3s',
      }} />
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '28px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 12.5 }}>
      {children}
    </div>
  )
}
