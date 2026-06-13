export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-16 px-6">
      <div className="max-w-[980px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <div className="text-[15px] font-bold tracking-tight mb-3">Caractère Store</div>
            <p className="text-[13px] text-white/45 leading-relaxed">Impression & Broderie Professionnelle — Alger, Algérie</p>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white/45 mb-4">Services</div>
            <ul className="flex flex-col gap-2.5 list-none">
              {['Broderie machine','Impression DTF','Uniformes B2B','Sérigraphie'].map(s => (
                <li key={s}><a href="/#services" className="text-[13px] text-white/60 hover:text-white no-underline">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white/45 mb-4">Produits</div>
            <ul className="flex flex-col gap-2.5 list-none">
              {['T-shirt','Polo MC','Polo ML','Sweat','Casquette'].map(p => (
                <li key={p}><a href="/#produits" className="text-[13px] text-white/60 hover:text-white no-underline">{p}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white/45 mb-4">Contact</div>
            <ul className="flex flex-col gap-2.5 list-none">
              <li><a href="https://wa.me/213XXXXXXXXX" className="text-[13px] text-white/60 hover:text-white no-underline" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a></li>
              <li><a href="https://instagram.com/caractere.store" className="text-[13px] text-white/60 hover:text-white no-underline" target="_blank" rel="noopener noreferrer">📸 @caractere.store</a></li>
              <li><span className="text-[13px] text-white/60">📍 Alger, Algérie</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/35">© {new Date().getFullYear()} Caractère Store.</p>
          <div className="flex gap-5">
            <a href="https://instagram.com/caractere.store" className="text-[12px] text-white/35 hover:text-white/60 no-underline" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/213XXXXXXXXX" className="text-[12px] text-white/35 hover:text-white/60 no-underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
