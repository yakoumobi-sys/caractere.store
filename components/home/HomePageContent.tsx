'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const C = {
  black: '#0C0A09',
  white: '#FAFAF9',
  gray: '#1C1917',
  grayMed: '#A8A29E',
  gold: '#D4A574',
}

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body, html { 
      font-family: 'Montserrat', sans-serif;
      background: #FAFAF9;
      color: #0C0A09;
      line-height: 1.6;
      font-weight: 700;
    }

    .display { font-weight: 800; font-size: 42px; }

    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .7s ease-out, transform .7s ease-out; }
    .reveal.in { opacity: 1; transform: translateY(0); }

    header {
      position: sticky; top: 0; z-index: 100;
      background: ${C.white};
      border-bottom: 1px solid #E5E7EB;
      padding: 16px 24px;
      display: flex; justify-content: space-between; align-items: center;
    }

    header img { height: 36px; width: auto; }
    header nav { display: flex; gap: 24px; }
    header a { text-decoration: none; color: #0C0A09; font-weight: 800; font-size: 14px; transition: color .3s; }
    header a:hover { color: ${C.gold}; }

    .hero {
      padding: 80px 24px;
      text-align: center;
      background: linear-gradient(135deg, #FAFAF9 0%, #F3F4F6 100%);
    }

    .hero h1 { 
      font-size: clamp(36px, 8vw, 72px);
      margin-bottom: 16px;
      line-height: 1.1;
      font-weight: 800;
    }

    .hero p { 
      font-size: 18px;
      max-width: 600px;
      margin: 0 auto 32px;
      color: #6B7280;
      font-weight: 700;
    }

    .cta-group {
      display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 800;
      text-decoration: none;
      cursor: pointer;
      transition: all .3s;
      border: none;
      font-size: 14px;
      display: inline-flex; align-items: center; gap: 8px;
    }

    .btn-primary { 
      background: ${C.black}; 
      color: ${C.white};
    }
    .btn-primary:hover { 
      background: ${C.gold};
      color: ${C.black};
      transform: translateY(-2px);
    }

    .btn-secondary { 
      border: 2px solid ${C.black};
      background: transparent;
      color: ${C.black};
    }
    .btn-secondary:hover { 
      background: ${C.black};
      color: ${C.white};
    }

    .logo-section {
      padding: 60px 24px;
      text-align: center;
    }

    .logo-section img {
      max-width: 240px;
      height: auto;
      margin-bottom: 32px;
    }

    .section {
      padding: 80px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .section h2 {
      font-size: 42px;
      margin-bottom: 48px;
      text-align: center;
      font-weight: 800;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .card {
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      padding: 32px 20px;
      text-align: center;
      transition: transform .3s, box-shadow .3s, background .3s;
      background: #F9FAFB;
      text-decoration: none;
      color: #0C0A09;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 35px rgba(0,0,0,0.12);
      background: ${C.white};
    }

    .card .icon { font-size: 48px; margin-bottom: 16px; display: block; }
    .card p { font-weight: 800; font-size: 15px; }

    .testimonials {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .testimonial {
      background: #F9FAFB;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
    }

    .testimonial p { font-size: 14px; margin-bottom: 16px; line-height: 1.8; color: #6B7280; font-weight: 700; }
    .testimonial .author { font-weight: 800; font-size: 13px; }
    .testimonial .role { font-size: 12px; color: #9CA3AF; font-weight: 700; }

    .pricing {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .price-card {
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 32px 24px;
      text-align: center;
      transition: all .3s;
      background: #F9FAFB;
    }

    .price-card.featured {
      border: 2px solid ${C.gold};
      transform: scale(1.02);
      box-shadow: 0 10px 30px rgba(212,165,116,0.2);
      background: ${C.white};
    }

    .price-card h3 { font-size: 18px; margin-bottom: 8px; font-weight: 800; }
    .price-card .amount { font-size: 36px; font-weight: 800; margin: 16px 0; }
    .price-card p { font-size: 12px; color: #6B7280; margin-bottom: 24px; font-weight: 700; }

    .price-card .btn { width: 100%; justify-content: center; }

    .features {
      list-style: none;
      margin-bottom: 24px;
      text-align: left;
    }

    .features li { 
      padding: 12px 0; 
      font-size: 14px;
      border-bottom: 1px solid #E5E7EB;
      font-weight: 700;
    }

    .faq {
      max-width: 700px;
      margin: 0 auto;
    }

    .faq-item {
      border-bottom: 1px solid #E5E7EB;
      padding: 24px 0;
      cursor: pointer;
    }

    .faq-item h3 {
      font-weight: 800;
      margin-bottom: 8px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 15px;
    }

    .faq-item p { 
      font-size: 14px; 
      color: #6B7280;
      line-height: 1.8;
      display: none;
      font-weight: 700;
    }

    .faq-item.active p { display: block; }

    footer {
      background: #0C0A09;
      color: ${C.white};
      padding: 48px 24px;
      text-align: center;
    }

    footer p { font-size: 12px; color: #A8A29E; font-weight: 700; }

    @media (max-width: 768px) {
      header nav { gap: 12px; }
      .section { padding: 48px 20px; }
      .section h2 { font-size: 28px; }
      .grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
      .price-card.featured { transform: scale(1); }
    }
  `}</style>
)

export default function HomePageContent() {
  const [activeTab, setActiveTab] = useState(0)

  useReveal()

  const shortcuts = [
    { icon: '🎨', name: 'Designer', href: '/designer' },
    { icon: '🧊', name: 'Studio 3D', href: '/studio-3d' },
    { icon: '👕', name: 'Produits', href: '/produits' },
    { icon: '⭐', name: 'Collection', href: '/collection' },
    { icon: '📚', name: 'Comment ça marche', href: '/comment-ca-marche' },
  ]

  const testimonials = [
    { text: '80 polos en 48h. Qualité impeccable.', author: 'Karim B.', role: 'Restaurant El Kef' },
    { text: '45 blouses parfaites. Livraison rapide.', author: 'Dr. Samira M.', role: 'Clinique Al Chifa' },
    { text: '120 gilets robustes. On recommande!', author: 'Yacine O.', role: 'BTP Construct' },
  ]

  const pricing = [
    { name: 'DTF Standard', price: '1950', desc: 'Dès 1 pièce' },
    { name: 'DTF Premium', price: '2450', desc: 'Couleurs pleines', featured: true },
    { name: 'Broderie', price: '3950', desc: 'Logo haute densité' },
  ]

  const faqs = [
    { q: 'Délai de production?', a: '48h à Alger. Livraison 3-5 jours selon wilaya.' },
    { q: 'Minimum de commande?', a: 'Pas de minimum! 1 pièce ou 1000. Prix adapté.' },
    { q: 'Paiements acceptés?', a: 'BaridiMob, CCP, virement. Paiement livraison pour Alger.' },
    { q: 'Suivi commande?', a: 'Oui! WhatsApp direct + photos production. Info permanente.' },
  ]

  return (
    <div style={{ background: '#FAFAF9', color: '#0C0A09' }}>
      <GlobalStyle />

      {/* Header */}
      <header>
        <img src={LOGO} alt="Caractère" />
        <nav>
          <a href="#raccourcis">Outils</a>
          <a href="#pricing">Tarifs</a>
          <a href="#reviews">Avis</a>
          <a href="https://wa.me/213557440522">WhatsApp</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="reveal">
          <h1>Votre marque en 48h</h1>
          <p>DTF • Broderie • Uniformes | Sans stock • Sans risque</p>
          <div className="cta-group">
            <Link href="/designer" className="btn btn-primary">🎨 Designer gratuit</Link>
            <a href="https://wa.me/213557440522" className="btn btn-secondary">💬 Question?</a>
          </div>
        </div>
      </section>

      {/* Logo Grand */}
      <section className="logo-section">
        <img src={LOGO} alt="Caractère Store Logo" className="reveal" />
      </section>

      {/* Raccourcis */}
      <section className="section" id="raccourcis">
        <h2 className="display reveal">Accès rapide</h2>
        <div className="grid">
          {shortcuts.map((s, i) => (
            <Link key={i} href={s.href} className="card reveal">
              <span className="icon">{s.icon}</span>
              <p>{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ background: '#F9FAFB' }}>
        <div className="grid">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>50K+</div>
            <p style={{ color: '#6B7280', fontWeight: 700 }}>Pièces produites</p>
          </div>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>500+</div>
            <p style={{ color: '#6B7280', fontWeight: 700 }}>Entreprises satisfaites</p>
          </div>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>48h</div>
            <p style={{ color: '#6B7280', fontWeight: 700 }}>Production Alger</p>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section">
        <h2 className="display reveal">Pourquoi Caractère?</h2>
        <div className="grid">
          {[
            { title: 'Production locale', desc: 'À Alger. Sans attente.' },
            { title: 'Qualité garantie', desc: 'DTF, broderie, uniformes.' },
            { title: 'Suivi transparent', desc: 'WhatsApp + photos.' },
            { title: 'Sans stock', desc: 'À la demande. Zéro risque.' },
            { title: 'Depuis 1 pièce', desc: 'Pas de minimum.' },
            { title: 'Rabais volume', desc: 'Jusqu\'à −30%.' },
          ].map((b, i) => (
            <div key={i} className="card reveal">
              <p style={{ marginBottom: '8px', fontSize: '16px' }}>{b.title}</p>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="reviews" style={{ background: '#F9FAFB' }}>
        <h2 className="display reveal">Clients satisfaits</h2>
        <div className="testimonials">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial reveal">
              <p>"{t.text}"</p>
              <div className="author">{t.author}</div>
              <div className="role">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <h2 className="display reveal">Tarifs simples</h2>
        <div className="pricing">
          {pricing.map((p, i) => (
            <div key={i} className={`price-card reveal ${p.featured ? 'featured' : ''}`}>
              <h3>{p.name}</h3>
              <div className="amount">{p.price} DA</div>
              <p>{p.desc}</p>
              <Link href="/designer" className="btn btn-primary">Commander</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: '#F9FAFB' }}>
        <h2 className="display reveal" style={{ marginBottom: '32px' }}>Questions fréquentes</h2>
        <div className="faq">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`faq-item reveal ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === i ? -1 : i)}
            >
              <h3>
                {f.q}
                <span>{activeTab === i ? '−' : '+'}</span>
              </h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="section" style={{ background: C.black, color: C.white, textAlign: 'center' }}>
        <h2 className="display reveal" style={{ color: C.white, marginBottom: '24px' }}>Prêt à lancer?</h2>
        <p style={{ marginBottom: '32px', color: '#A8A29E', fontWeight: 700 }}>Commencez maintenant. Zéro stock. Zéro engagement.</p>
        <div className="cta-group">
          <Link href="/designer" className="btn btn-primary" style={{ background: C.gold, color: C.black }}>
            🎨 Designer gratuit
          </Link>
          <a href="https://wa.me/213557440522" className="btn btn-secondary" style={{ borderColor: C.white, color: C.white }}>
            💬 WhatsApp direct
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2024 Caractère Store • DTF • Broderie • Uniformes • Production 48h • Alger</p>
        <p style={{ marginTop: '12px' }}>📞 +213 557 440 522 • 📧 yakoumobi@gmail.com</p>
      </footer>
    </div>
  )
}
