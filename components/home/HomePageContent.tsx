'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const C = {
  black: '#0C0A09',
  white: '#FAFAF9',
  gray: '#1C1917',
  grayMed: '#A8A29E',
  gold: '#D4A574',
  lime: '#A3E635',
}

// Images GitHub
const IMAGES = {
  img1: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7474.jpeg',
  img2: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7473.jpeg',
  img3: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7468.jpeg',
  img4: 'https://raw.githubusercontent.com/yakoumobi-sys/caractere.store/main/public/collection/IMG_7465.jpeg',
}

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
    @import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@700;800&family=Montserrat:wght@300;400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body { 
      font-family: 'Montserrat', sans-serif;
      background: #FAFAF9;
      color: #0C0A09;
      line-height: 1.6;
    }

    .display { font-family: 'Cormorant', serif; font-weight: 800; }
    .bold { font-weight: 700; }

    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .7s ease-out, transform .7s ease-out; }
    .reveal.in { opacity: 1; transform: translateY(0); }

    header {
      position: sticky; top: 0; z-index: 100;
      background: ${C.white};
      border-bottom: 1px solid #E5E7EB;
      padding: 16px 24px;
      display: flex; justify-content: space-between; align-items: center;
    }

    header .logo { font-size: 20px; font-weight: 800; letter-spacing: -1px; }
    header nav { display: flex; gap: 24px; }
    header a { text-decoration: none; color: #0C0A09; font-weight: 600; font-size: 14px; transition: color .3s; }
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
    }

    .hero p { 
      font-size: 18px;
      max-width: 600px;
      margin: 0 auto 32px;
      color: #6B7280;
    }

    .cta-group {
      display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 700;
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
      transform: translateY(-2px);
    }

    .btn-secondary { 
      border: 1.5px solid ${C.black};
      background: transparent;
      color: ${C.black};
    }
    .btn-secondary:hover { 
      background: ${C.black};
      color: ${C.white};
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
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .card {
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      overflow: hidden;
      transition: transform .3s, box-shadow .3s;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    .card img { width: 100%; height: 200px; object-fit: cover; }
    .card p { padding: 16px; font-weight: 600; font-size: 14px; }

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

    .testimonial p { font-size: 14px; margin-bottom: 16px; line-height: 1.8; color: #6B7280; }
    .testimonial .author { font-weight: 700; font-size: 13px; }
    .testimonial .role { font-size: 12px; color: #9CA3AF; }

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
    }

    .price-card.featured {
      border: 2px solid ${C.gold};
      transform: scale(1.02);
      box-shadow: 0 10px 30px rgba(212,165,116,0.2);
    }

    .price-card h3 { font-size: 18px; margin-bottom: 8px; }
    .price-card .amount { font-size: 36px; font-weight: 800; margin: 16px 0; }
    .price-card p { font-size: 12px; color: #6B7280; margin-bottom: 24px; }

    .features {
      list-style: none;
      margin-bottom: 24px;
      text-align: left;
    }

    .features li { 
      padding: 8px 0; 
      font-size: 13px;
      border-bottom: 1px solid #E5E7EB;
    }

    .faq {
      max-width: 700px;
      margin: 0 auto;
    }

    .faq-item {
      border-bottom: 1px solid #E5E7EB;
      padding: 20px 0;
      cursor: pointer;
    }

    .faq-item h3 {
      font-weight: 700;
      margin-bottom: 8px;
      display: flex; justify-content: space-between; align-items: center;
    }

    .faq-item p { 
      font-size: 14px; 
      color: #6B7280;
      line-height: 1.8;
      display: none;
    }

    .faq-item.active p { display: block; }

    footer {
      background: #0C0A09;
      color: ${C.white};
      padding: 48px 24px;
      text-align: center;
    }

    footer p { font-size: 12px; color: #A8A29E; }

    @media (max-width: 768px) {
      header nav { gap: 12px; }
      .section { padding: 48px 20px; }
      .section h2 { font-size: 28px; }
      .grid { grid-template-columns: 1fr; }
    }
  `}</style>
)

export default function HomePageContent() {
  const [activeTab, setActiveTab] = useState(0)

  useReveal()

  const products = [
    { img: IMAGES.img1, name: 'T-shirt DTF' },
    { img: IMAGES.img2, name: 'Polo Broderie' },
    { img: IMAGES.img3, name: 'Hoodie Custom' },
    { img: IMAGES.img4, name: 'Uniforme' },
  ]

  const testimonials = [
    {
      text: '80 polos en 48h. Qualité impeccable, délai respecté. On recommande!',
      author: 'Karim B.',
      role: 'Restaurant El Kef'
    },
    {
      text: '45 blouses pour l'équipe. Broderie précise, tout est parfait.',
      author: 'Dr. Samira M.',
      role: 'Clinique Al Chifa'
    },
    {
      text: '120 gilets de chantier en 5 jours. Toujours parfait après 1 mois d\'utilisation.',
      author: 'Yacine O.',
      role: 'BTP Construct'
    },
  ]

  const pricing = [
    { name: 'DTF Standard', price: '1950', desc: 'Dès 1 pièce' },
    { name: 'DTF Premium', price: '2450', desc: 'Couleurs pleines', featured: true },
    { name: 'Broderie', price: '3950', desc: 'Logo haute densité' },
  ]

  const faqs = [
    {
      q: 'Quel est le délai de production?',
      a: 'Production standard 48h à Alger. Livraison 3-5 jours selon la wilaya.'
    },
    {
      q: 'Quel est le minimum de commande?',
      a: 'Pas de minimum! Tu peux commander 1 pièce ou 1000. Prix adapté selon quantité.'
    },
    {
      q: 'Quels paiements acceptez-vous?',
      a: 'BaridiMob, CCP, virement bancaire. Paiement à la livraison possible pour Alger.'
    },
    {
      q: 'Puis-je suivre ma commande?',
      a: 'Oui! Suivi WhatsApp direct + photos de production. Vous êtes toujours informés.'
    },
  ]

  return (
    <div style={{ background: '#FAFAF9', color: '#0C0A09' }}>
      <GlobalStyle />

      {/* Header */}
      <header>
        <div className="logo">CARACTÈRE</div>
        <nav>
          <a href="#products">Produits</a>
          <a href="#designer">Designer</a>
          <a href="#pricing">Tarifs</a>
          <a href="https://wa.me/213557440522">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="reveal">
          <h1 className="display">Votre marque, en 48h</h1>
          <p>DTF, broderie, uniformes. Depuis 1 pièce. Sans stock. Sans risque.</p>
          <div className="cta-group">
            <Link href="/designer" className="btn btn-primary">🎨 Designer gratuit</Link>
            <Link href="/print-on-demand" className="btn btn-secondary">En savoir plus</Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section" id="products">
        <h2 className="display reveal">Bestsellers</h2>
        <div className="grid">
          {products.map((p, i) => (
            <div key={i} className={`card reveal`}>
              <img src={p.img} alt={p.name} />
              <p>{p.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ background: '#F9FAFB' }}>
        <div className="grid">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div className="display" style={{ fontSize: '36px' }}>50K+</div>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Pièces produites</p>
          </div>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div className="display" style={{ fontSize: '36px' }}>500+</div>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Entreprises satisfaites</p>
          </div>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <div className="display" style={{ fontSize: '36px' }}>48h</div>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Délai de production</p>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="section">
        <h2 className="display reveal">Pourquoi Caractère?</h2>
        <div className="grid">
          {[
            { title: 'Production locale', desc: 'À Alger. Pas d\'attente d\'import.' },
            { title: 'Qualité garantie', desc: 'DTF premium, broderie 3D, uniformes robustes.' },
            { title: 'Suivi transparent', desc: 'WhatsApp direct + photos de production.' },
            { title: 'Sans stock', desc: 'Commande à la demande, zéro risque.' },
            { title: 'Depuis 1 pièce', desc: 'Pas de minimum, prix dès l\'unité.' },
            { title: 'Rabais volume', desc: 'Jusqu\'à −30% à partir de 500 pièces.' },
          ].map((b, i) => (
            <div key={i} className="card reveal" style={{ border: 'none', background: '#F9FAFB' }}>
              <div style={{ padding: '24px' }}>
                <p style={{ fontWeight: 700, marginBottom: '8px' }}>{b.title}</p>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="reviews">
        <h2 className="display reveal">Ce que disent les clients</h2>
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
        <h2 className="display reveal">Tarifs simples</h2>
        <div className="pricing">
          {pricing.map((p, i) => (
            <div key={i} className={`price-card reveal ${p.featured ? 'featured' : ''}`}>
              <h3>{p.name}</h3>
              <div className="amount">{p.price} DA</div>
              <p>{p.desc}</p>
              <Link href="/designer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Commander
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
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
                <span style={{ fontSize: '16px' }}>{activeTab === i ? '−' : '+'}</span>
              </h3>
              <p>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="section" style={{ background: C.black, color: C.white, textAlign: 'center' }}>
        <h2 className="display reveal" style={{ color: C.white, marginBottom: '24px' }}>Prêt?</h2>
        <p style={{ marginBottom: '32px', color: '#A8A29E' }}>Commence maintenant. Zéro stock. Zéro risque.</p>
        <div className="cta-group">
          <Link href="/designer" className="btn btn-primary" style={{ background: C.gold, color: C.black }}>
            🎨 Designer gratuit
          </Link>
          <a href="https://wa.me/213557440522" className="btn btn-secondary" style={{ borderColor: C.white, color: C.white }}>
            💬 WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2024 Caractère Store. DTF • Broderie • Uniformes • Production 48h • Alger</p>
        <p style={{ marginTop: '12px' }}>+213 557 440 522 · yakoumobi@gmail.com</p>
      </footer>
    </div>
  )
}
