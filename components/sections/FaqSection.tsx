'use client'
import { useState } from 'react'

const faqs = [
  {q:'Quelle est la quantité minimale ?',a:'Commandes acceptées à partir de 10 pièces. Remises automatiques dès 50 (−5%) puis 100 pièces (−10%).'},
  {q:'Quels formats pour le logo ?',a:'Idéalement .AI, .EPS, .SVG ou .PDF vectorisé. Si vous avez un .PNG haute résolution (300 dpi min), notre équipe vectorise gratuitement.'},
  {q:'Quel est le délai de production ?',a:'3 à 7 jours ouvrables après validation de la maquette et paiement. Service express disponible sur demande.'},
  {q:'Broderie ou DTF, comment choisir ?',a:'Broderie : logos simples sur polos et casquettes, rendu 3D premium. DTF : designs complexes, multi-couleurs ou grande surface.'},
  {q:"Livraison en dehors d'Alger ?",a:'Oui, livraison dans toute l\'Algérie via partenaires. Retrait direct à l\'atelier également possible.'},
]

export default function FaqSection() {
  const [open, setOpen] = useState<number|null>(null)
  return (
    <section id="faq" className="py-28 px-6">
      <div className="max-w-[980px] mx-auto">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">FAQ</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">Questions<br />fréquentes.</h2>
        <div className="mt-14 max-w-[700px]">
          {faqs.map((f,i) => (
            <div key={i} className="border-b border-black/[0.08]">
              <button className="w-full py-5 text-[16px] font-medium tracking-tight text-brand-dark flex justify-between items-center text-left cursor-pointer bg-transparent border-none" onClick={() => setOpen(open===i?null:i)}>
                {f.q}
                <span className="text-brand-gray text-[16px] flex-shrink-0 transition-transform duration-300 ml-4" style={{transform:open===i?'rotate(180deg)':'rotate(0deg)'}}>⌄</span>
              </button>
              <div className={`faq-answer ${open===i?'open':''}`}>
                <p className="text-[14px] text-brand-gray leading-[1.7]">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
