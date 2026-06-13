'use client'
import { useState } from 'react'

export default function ContactSection({ config }: { config: Record<string,string> }) {
  const [sent, setSent] = useState(false)
  const wa = config['whatsapp_numero'] ?? '213XXXXXXXXX'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await fetch('/api/contact', { method: 'POST', body: JSON.stringify(Object.fromEntries(fd)), headers: {'Content-Type':'application/json'} })
    setSent(true)
  }

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-[980px] mx-auto">
        <span className="text-[11px] font-bold tracking-widest uppercase text-brand-gray block mb-3.5">Contact</span>
        <h2 className="text-[clamp(30px,4.5vw,50px)] font-bold tracking-tight leading-[1.06] text-brand-dark">Parlons de<br />votre projet.</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[72px] items-start mt-14">
          <div className="flex flex-col">
            {[
              {icon:'📱',label:'WhatsApp / Téléphone',value:`+${wa}`,href:`tel:+${wa}`},
              {icon:'📍',label:'Atelier',value:config['adresse']??'Alger, Algérie',href:null},
              {icon:'📸',label:'Instagram',value:config['instagram']??'@caractere.store',href:'https://instagram.com/caractere.store'},
              {icon:'⏱',label:'Réponse devis',value:config['delai_reponse']??'Sous 24 heures',href:null},
            ].map((item,i) => (
              <div key={i} className="flex gap-3.5 items-start py-[22px] border-b border-black/[0.07] first:border-t first:border-black/[0.07]">
                <span className="text-[18px] mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-1">{item.label}</div>
                  {item.href ? <a href={item.href} className="text-[15px] font-medium text-brand-dark no-underline hover:opacity-70">{item.value}</a> : <span className="text-[15px] font-medium text-brand-dark">{item.value}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-brand-light rounded-[20px] p-8">
            <div className="text-[17px] font-semibold tracking-tight mb-6">Demande de devis gratuit</div>
            {sent ? (
              <div className="text-center py-8"><div className="text-[40px] mb-3">✅</div><p className="text-[15px] font-medium">Demande envoyée — réponse sous 24h !</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Nom complet</label><input name="nom" type="text" placeholder="Votre nom" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none" /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Téléphone</label><input name="telephone" type="tel" placeholder="+213 6XX XXX XXX" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none" /></div>
                </div>
                <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Entreprise</label><input name="entreprise" type="text" placeholder="Nom entreprise" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Produit</label>
                    <select name="produit" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none">
                      <option>Choisir...</option><option>T-shirt</option><option>Polo MC</option><option>Polo ML</option><option>Sweat</option><option>Sweat Capuche</option><option>Casquette</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Quantité</label>
                    <select name="quantite" className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none">
                      <option>Choisir...</option><option>10–49 pièces</option><option>50–99 pièces</option><option>100–299 pièces</option><option>300+ pièces</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5"><label className="text-[12px] font-medium">Détails</label><textarea name="details" rows={4} placeholder="Technique, couleurs, délai..." className="border border-black/[0.12] rounded-xl px-4 py-2.5 text-[14px] bg-white focus:outline-none resize-none" /></div>
                <button type="submit" className="bg-brand-dark text-white py-3.5 rounded-full text-[15px] font-medium hover:bg-neutral-800 transition-colors">Envoyer la demande</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
