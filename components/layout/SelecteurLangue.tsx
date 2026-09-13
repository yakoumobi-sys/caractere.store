'use client'

// Bascule FR / AR du parcours d'achat.
// Le choix est porté par le contexte de lib/i18n.tsx, qui met aussi à jour
// `<html lang dir>` : la mise en page passe en RTL sans feuille de style
// dédiée, les styles utilisant des propriétés logiques.

import { useLangue, type Langue } from '@/lib/i18n'
import styles from './SelecteurLangue.module.css'

const LANGUES: { code: Langue; label: string; aria: string }[] = [
  { code: 'fr', label: 'FR', aria: 'Afficher la page en français' },
  { code: 'ar', label: 'ع', aria: 'عرض الصفحة بالعربية' },
]

export default function SelecteurLangue() {
  const { langue, definirLangue } = useLangue()

  return (
    <div className={styles.groupe} role="group" aria-label="Langue / اللغة">
      {LANGUES.map(l => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          onClick={() => definirLangue(l.code)}
          aria-pressed={langue === l.code}
          aria-label={l.aria}
          className={`${styles.bouton} ${langue === l.code ? styles.actif : ''}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
