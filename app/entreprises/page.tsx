'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const C = {
  black: '#0C0A09',
  white: '#FAFAF9',
  gold: '#D4A574',
}

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/logos/caracterere-logo.png'

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
      max-width: 200px;
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

    footer {
      background: #0C0A09;
      color: ${C.white};
      padding: 48px 24px;
      text-align: center;
    }

    footer p { font-size: 12px; color: #A8A29E; font-weight: 700; }

    @media (max-width: 768px) {
      .section { padding: 48px 20px; }
      .section h2 { font-size: 28px; }
      .grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
      .price-card.featured { transform: scale(1); }
    }
  `}</style>
)

export default function EntreprisePage() {
  useReveal()

  const benefits = [
    { icon: '⚙️', title: 'Configurateur', desc: 'Design personnalisé en ligne' },
    { icon: '🎨', title: 'Designer gratuit', desc: 'Équipe spécialisée pour vous' },
    { icon: '📊', title: 'Tarifs rabais', desc: 'Jusqu\'à −30% en volume' },
    { icon: '⏱️', title: '48h production', desc: 'Délai garanti Alger' },
    { icon: '📸', title: 'Suivi photos', desc: 'Avant expédition' },
    { icon: '🚚', title: 'Livraison nationale', desc: 'Dans toute l\'Algérie' },
  ]

  const testimonials = [
    { text: '80 polos en 48h. Qualité restaurant-pro.', author: 'Karim B.', role: 'El Kef Restaurant' },
    { text: '45 blouses médicales. Parfait!', author: 'Dr. Samira M.', role: 'Clinique Al Chifa' },
    { text: '120 gilets chantier. Solides après 1 mois.', author: 'Yacine O.', role: 'BTP Construct' },
  ]

  const pricing = [
    { qty: '1-50', price: '1950', desc: 'Tarif standard' },
    { qty: '51-200', price: '1650', desc: '−15%', featured: true },
    { qty: '200+', price: '1400-1200', desc: '−25% à −30%' },
  ]

  return (
    <div style={{ background: '#FAFAF9', color: '#0C0A09' }}>
      <GlobalStyle />

      {/* Header */}
      <header>
        <Link href="/">
          <img src={LOGO} alt="Caractère" />
        </Link>
        <nav>
          <a href="#benefits">Avantages</a>
          <a href="#pricing">Tarifs</a>
          <a href="#reviews">Avis</a>
          <a href="https://wa.me/213557440522" style={{ color: C.gold }}>WhatsApp</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="reveal">
          <h1>Uniformes & branding</h1>
          <p>Restaurants • Cliniques • Corporations • BTP | Production garantie 48h</p>
          <div className="cta-group">
            <Link href="/configurateur" className="btn btn-primary">⚙️ Configurer ma commande</Link>
            <a href="https://wa.me/213557440522" className="btn btn-secondary">💬 Devis gratuit</a>
          </div>
        </div>
      </section>

      {/* Logo */}
      <section className="logo-section">
        <img src={LOGO} alt="Caractère Store" className="reveal" />
      </section>

      {/* Benefits */}
      <section className="section" id="benefits">
        <h2 className="display reveal">Pourquoi nous?</h2>
        <div className="grid">
          {benefits.map((b, i) => (
            <div key={i} className="card reveal">
              <span className="icon">{b.icon}</span>
              <p style={{ marginBottom: '8px' }}>{b.title}</p>
              <p style={{ fontSize: '13px', color: '#6B7280' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secteurs */}
      <section className="section" style={{ background: '#F9FAFB' }}>
        <h2 className="display reveal">Nos secteurs</h2>
        <div className="grid">
          {['🍽️ Restaurants', '🏥 Cliniques & hôpitaux', '🏢 Corporations', '🏗️ BTP & construction', '👔 Banques & assurances', '📦 E-commerce & logistique'].map((s, i) => (
            <div key={i} className="card reveal">
              <p>{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="reviews">
        <h2 className="display reveal">Clients professionnels</h2>
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
      <section className="section" id="pricing" style={{ background: '#F9FAFB' }}>
        <h2 className="display reveal">Tarifs par volume</h2>
        <div className="pricing">
          {pricing.map((p, i) => (
            <div key={i} className={`price-card reveal ${p.featured ? 'featured' : ''}`}>
              <h3>{p.qty} pièces</h3>
              <div className="amount">{p.price} DA</div>
              <p>{p.desc}</p>
              <Link href="/configurateur" className="btn btn-primary">Commander</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <h2 className="display reveal">Processus simple</h2>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          {['1️⃣ Configurez votre design', '2️⃣ Validez le devis', '3️⃣ On produit (48h)', '4️⃣ Livraison garantie'].map((step, i) => (
            <div key={i} className="reveal" style={{ marginBottom: '24px', padding: '20px', background: '#F9FAFB', borderRadius: '12px', fontWeight: 800 }}>
              {step}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="section" style={{ background: C.black, color: C.white, textAlign: 'center' }}>
        <h2 className="display reveal" style={{ color: C.white, marginBottom: '24px' }}>Prêt à lancer?</h2>
        <p style={{ marginBottom: '32px', color: '#A8A29E', fontWeight: 700 }}>Obtenez un devis en 2h maximum</p>
        <div className="cta-group">
          <Link href="/configurateur" className="btn btn-primary" style={{ background: C.gold, color: C.black }}>
            ⚙️ Configurer ma commande
          </Link>
          <a href="https://wa.me/213557440522" className="btn btn-secondary" style={{ borderColor: C.white, color: C.white }}>
            💬 WhatsApp direct
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2024 Caractère Store • Uniformes & Branding • Production 48h • Alger</p>
        <p style={{ marginTop: '12px' }}>📞 +213 557 440 522 • 📧 yakoumobi@gmail.com</p>
      </footer>
    </div>
  )
}
