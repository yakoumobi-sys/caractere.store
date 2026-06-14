'use client'
import { useState } from 'react'

const faqs = [
  {q:'Quelle est la quantite minimale ?',a:'Commandes acceptees a partir de 1 piece. Remises automatiques des 50 (-5%) puis 100 pieces (-10%).'},
  {q:'Quels formats pour le logo ?',a:'Idealement .AI, .EPS, .SVG ou .PDF vectorise. Si vous avez un .PNG haute resolution (300 dpi min), notre equipe vectorise gratuitement.'},
  {q:'Quel est le delai de production ?',a:'3 a 5 jours ouvrables apres validation de la maquette et paiement. Service express disponible sur demande.'},
  {q:'Broderie ou DTF, comment choisir ?',a:'Broderie : logos simples sur polos et casquettes, rendu 3D premium. DTF : designs complexes, multi-couleurs ou grande surface.'},
  {q:"Livraison en dehors d Alger ?",a:"Oui, livraison dans toute l Algerie via partenaires. Retrait direct a l atelier egalement possible."},
]

export default function FaqSection() {
  const [open, setOpen] = useState<number|null>(null)
  return (
    <section id="faq" className="py-28 px-6">
      <div className="max-w-[980px] mx-auto">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">FAQ</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">Questions<br />frequentes.</h2>
        <div className="mt-14 max-w-[700px]">
          {faqs.map((f,i) => (
            <div key={i} className="border-b border-black/[0.08]">
              <button className="w-full py-5 text-[16px] font-medium tracking-tight text-brand-dark flex justify-between items-center text-left cursor-pointer bg-transparent border-none" onClick={() => setOpen(open===i?null:i)}>
                {f.q}
                <span className="text-brand-gray text-[16px] flex-shrink-0 transition-transform duration-300 ml-4" style={{transform:open===i?'rotate(180deg)':'rotate(0deg)'}}>v</span>
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
