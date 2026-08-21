// Petits utilitaires de dates pour les vues Aujourd'hui / Semaine / Mois de JARVIS.

export function startOfDay(d = new Date()) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

export function endOfDay(d = new Date()) {
  const c = new Date(d)
  c.setHours(23, 59, 59, 999)
  return c
}

export function startOfWeek(d = new Date()) {
  const c = startOfDay(d)
  const day = (c.getDay() + 6) % 7 // lundi = 0
  c.setDate(c.getDate() - day)
  return c
}

export function endOfWeek(d = new Date()) {
  const c = startOfWeek(d)
  c.setDate(c.getDate() + 6)
  return endOfDay(c)
}

export function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(d = new Date()) {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0))
}

export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export function formatDateFR(dateStr: string | null | undefined) {
  if (!dateStr) return ''
  const d = new Date(dateStr.length <= 10 ? `${dateStr}T00:00:00` : dateStr)
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatTimeFR(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTimeShort(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}
