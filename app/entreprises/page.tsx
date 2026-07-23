'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const C = {
  black: '#0C0A09',
  dark: '#111113',
  white: '#FAFAF9',
  gold: '#D4A574',
  muted: '#A8A29E',
}

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
const WA = 'https://wa.me/213557440522'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body, html {
      font-family: 'Montserrat', sans-serif;
      background: ${C.black};
      color: ${C.white};
      font-weight: 600;
      line-height: 1.6;
    }

    .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease-out, transform .7s ease-out; }
    .reveal.in { opacity: 1; transform: translateY(0); }

    header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(12,10,9,.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(250,250,249,.08);
      padding: 14px 24px;
      display: flex; justify-content: space-between; align-items: center;
    }
    header img { height: 34px; width: auto; }
    header .wa-btn {
      background: ${C.gold}; color: ${C.black};
      padding: 10px 18px; border-radius: 8px;
      font-weight: 800; font-size: 13px; text-decoration: none;
      transition: transform .25s;
    }
    header .wa-btn:hover { transform: translateY(-2px); }

    .wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    .hero { padding: 90px 0 70px; text-align: center; position: relative; }
    .hero .eyebrow {
      display: inline-block;
      border: 1px solid rgba(212,165,116,.4);
      color: ${C.gold};
      padding: 6px 16px; border-radius: 999px;
      font-size: 12px; font-weight: 800; letter-spacing: 2px;
      text-transform: uppercase; margin-bottom: 28px;
    }
    .hero h1 {
      font-size: clamp(34px, 6.5vw, 66px);
      font-weight: 900; line-height: 1.08;
      margin-bottom: 22px; letter-spacing: -1px;
    }
    .hero h1 .accent { color: ${C.gold}; }
    .hero .sub {
      font-size: 18px; color: ${C.muted};
      max-width: 640px; margin: 0 auto 36px; font-weight: 600;
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      padding: 16px 32px; border-radius: 10px;
      font-weight: 800; font-size: 15px;
      text-decoration: none; cursor: pointer;
      transition: transform .25s, box-shadow .3s; border: none;
    }
    .btn:hover { transform: translateY(-3px); }
    .btn-gold { background: ${C.gold}; color: ${C.black}; box-shadow: 0 12px 34px -12px rgba(212,165,116,.45); }
    .btn-ghost { border: 1.5px solid rgba(250,250,249,.25); color: ${C.white}; background: transparent; }
    .btn-ghost:hover { border-color: ${C.gold}; color: ${C.gold}; }

    .proofbar {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;
      margin-top: 44px; font-size: 13px; color: ${C.muted}; font-weight: 700;
    }
    .proofbar span { display: flex; align-items: center; gap: 7px; }
    .proofbar b { color: ${C.white}; }

    .section { padding: 80px 0; }
    .section-dark { background: ${C.dark}; }
    .kicker { color: ${C.gold}; font-size: 12px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 14px; text-align: center; }
    .h2 { font-size: clamp(28px, 4.5vw, 44px); font-weight: 900; text-align: center; line-height: 1.15; margin-bottom: 18px; letter-spacing: -0.5px; }
    .h2 .accent { color: ${C.gold}; }
    .lead { text-align: center; color: ${C.muted}; max-width: 620px; margin: 0 auto 52px; font-size: 16px; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }

    .pain {
      background: rgba(250,250,249,.03);
      border: 1px solid rgba(250,250,249,.08);
      border-radius: 14px; padding: 26px;
    }
    .pain .x { color: #EF4444; font-size: 20px; margin-bottom: 12px; display: block; }
    .pain p.title { font-weight: 800; font-size: 15px; margin-bottom: 6px; }
    .pain p.desc { font-size: 13px; color: ${C.muted}; }

    .value-card {
      background: rgba(250,250,249,.04);
      border: 1px solid rgba(250,250,249,.09);
      border-radius: 16px; padding: 30px 26px;
      transition: transform .3s, border-color .3s;
    }
    .value-card:hover { transform: translateY(-5px); border-color: rgba(212,165,116,.45); }
    .value-card .ico { font-size: 30px; margin-bottom: 16px; display: block; }
    .value-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 8px; }
    .value-card p { font-size: 13px; color: ${C.muted}; }
    .value-card .val { display: inline-block; margin-top: 14px; color: ${C.gold}; font-size: 12px; font-weight: 800; }

    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
    .step {
      background: rgba(250,250,249,.03);
      border: 1px solid rgba(250,250,249,.08);
      border-radius: 14px; padding: 28px 24px; position: relative;
    }
    .step .num {
      width: 40px; height: 40px; border-radius: 10px;
      background: rgba(212,165,116,.14); color: ${C.gold};
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 17px; margin-bottom: 16px;
    }
    .step h3 { font-size: 15px; font-weight: 800; margin-bottom: 6px; }
    .step p { font-size: 13px; color: ${C.muted}; }

    .testi {
      background: rgba(250,250,249,.04);
      border: 1px solid rgba(250,250,249,.09);
      border-radius: 16px; padding: 28px;
    }
    .testi .stars { color: ${C.gold}; letter-spacing: 2px; margin-bottom: 14px; font-size: 14px; }
    .testi .quote { font-size: 14px; line-height: 1.8; margin-bottom: 18px; color: ${C.white}; }
    .testi .who { font-weight: 800; font-size: 13px; }
    .testi .role { font-size: 12px; color: ${C.muted}; font-weight: 700; }
    .testi .result { display: inline-block; margin-top: 12px; background: rgba(212,165,116,.12); color: ${C.gold}; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; }

    .offer-box {
      background: linear-gradient(160deg, rgba(212,165,116,.12) 0%, rgba(250,250,249,.03) 60%);
      border: 1.5px solid rgba(212,165,116,.45);
      border-radius: 22px; padding: 46px 34px; text-align: center;
      max-width: 720px; margin: 0 auto;
    }
    .offer-box h3 { font-size: clamp(24px, 4vw, 34px); font-weight: 900; margin-bottom: 12px; }
    .offer-box .sub { color: ${C.muted}; font-size: 15px; margin-bottom: 30px; }
    .offer-list { text-align: left; max-width: 480px; margin: 0 auto 32px; }
    .offer-list li {
      list-style: none; display: flex; gap: 12px; align-items: flex-start;
      padding: 11px 0; border-bottom: 1px solid rgba(250,250,249,.07);
      font-size: 14px; font-weight: 700;
    }
    .offer-list li .check { color: ${C.gold}; font-weight: 900; }
    .offer-list li .strike { color: ${C.muted}; text-decoration: line-through; font-size: 12px; margin-left: 6px; }

    .guarantee {
      display: flex; gap: 18px; align-items: flex-start;
      background: rgba(250,250,249,.04);
      border: 1px solid rgba(250,250,249,.1);
      border-radius: 16px; padding: 28px; max-width: 720px; margin: 0 auto;
    }
    .guarantee .shield { font-size: 40px; }
    .guarantee h3 { font-size: 17px; font-weight: 900; margin-bottom: 8px; }
    .guarantee p { font-size: 14px; color: ${C.muted}; }

    .faq { max-width: 680px; margin: 0 auto; }
    .faq-item { border-bottom: 1px solid rgba(250,250,249,.09); padding: 22px 0; cursor: pointer; }
    .faq-item h3 { font-weight: 800; font-size: 15px; display: flex; justify-content: space-between; gap: 16px; }
    .faq-item .toggle { color: ${C.gold}; font-weight: 900; }
    .faq-item p { font-size: 14px; color: ${C.muted}; line-height: 1.8; margin-top: 12px; display: none; }
    .faq-item.active p { display: block; }

    .final {
      text-align: center; padding: 90px 24px;
      background: linear-gradient(160deg, rgba(212,165,116,.1) 0%, ${C.black} 65%);
    }
    .final h2 { font-size: clamp(30px, 5.5vw, 52px); font-weight: 900; line-height: 1.1; margin-bottom: 16px; }
    .final p { color: ${C.muted}; margin-bottom: 36px; font-size: 16px; }
    .final .micro { font-size: 12px; color: ${C.muted}; margin-top: 18px; }

    footer { background: ${C.black}; border-top: 1px solid rgba(250,250,249,.07); padding: 40px 24px; text-align: center; }
    footer img { height: 30px; margin-bottom: 16px; opacity: .9; }
    footer p { font-size: 12px; color: ${C.muted}; font-weight: 700; }

    @media (max-width: 768px) {
      .section { padding: 56px 0; }
      .guarantee { flex-direction: column; }
    }
  `}</style>
)

export default function EntreprisePage() {
  useReveal()
  const [faqOpen, setFaqOpen] = useState(0)

  const pains = [
    { title: 'Fournisseur en retard', desc: 'Votre événement est dans 5 jours. Lui, il répond dans 5 jours.' },
    { title: 'Qualité aléatoire', desc: 'Logo de travers, broderie qui se défait au premier lavage.' },
    { title: 'Zéro visibilité', desc: 'Vous payez, puis silence radio jusqu\'à la livraison. Ou pas.' },
    { title: 'Import = attente', desc: '6 semaines de Chine. Douane. Surprises. Stress.' },
  ]

  const values = [
    { ico: '⏱️', title: 'Production 48h — garantie écrite', desc: 'Votre commande sort de notre atelier d\'Alger en 48h ouvrées. Pas "environ". 48h.', val: 'Le délai le plus court d\'Algérie' },
    { ico: '📸', title: 'Photos avant expédition', desc: 'Vous validez chaque pièce en photo AVANT qu\'elle parte. Zéro mauvaise surprise à la réception.', val: 'Transparence totale' },
    { ico: '🎨', title: 'Maquette gratuite en 2h', desc: 'Envoyez votre logo, recevez la maquette professionnelle de vos uniformes en 2h. Sans engagement.', val: 'Valeur: 5 000 DA — offerte' },
    { ico: '🏭', title: 'Atelier local, 20 personnes', desc: 'DTF, broderie industrielle, presse. Tout sous un même toit à Alger. Vous pouvez même visiter.', val: 'Zéro intermédiaire' },
    { ico: '📉', title: 'Rabais volume jusqu\'à −30%', desc: 'Plus vous commandez, moins vous payez l\'unité. Grille tarifaire claire, sans négociation pénible.', val: 'Dès 51 pièces' },
    { ico: '🔁', title: 'Réassort en 1 message', desc: 'Vos designs sont archivés. Nouveau salarié? Un WhatsApp et son uniforme part en production.', val: 'Gain: des heures chaque mois' },
  ]

  const testimonials = [
    { quote: 'On avait un salon dans 4 jours et notre fournisseur habituel nous a lâchés. Caractère a produit 80 polos brodés en 48h. Qualité irréprochable, équipe au top le jour J.', who: 'Karim B.', role: 'Gérant — Restaurant El Kef', result: '80 polos • 48h chrono' },
    { quote: 'Les photos avant expédition, ça change tout. 45 blouses pour la clinique, chaque broderie validée avant l\'envoi. Zéro retour, zéro déception.', who: 'Dr. Samira M.', role: 'Directrice — Clinique Al Chifa', result: '45 blouses • 0 défaut' },
    { quote: '120 gilets haute visibilité avec notre logo. Un mois de chantier intensif plus tard: impeccables. Et le réassort se fait en un message WhatsApp.', who: 'Yacine O.', role: 'Directeur travaux — BTP Construct', result: '120 gilets • réassort auto' },
  ]

  const faqs = [
    { q: 'C\'est vraiment 48h? Même pour 200 pièces?', a: 'Oui. Notre atelier tourne avec 20 personnes et des machines industrielles DTF + broderie. Jusqu\'à 500 pièces, le délai de production de 48h ouvrées est garanti par écrit sur votre devis. Au-delà, on vous donne un délai précis avant que vous payiez quoi que ce soit.' },
    { q: 'Et si la qualité ne me convient pas?', a: 'Vous validez la maquette avant production, puis les photos avant expédition. Si malgré ça une pièce présente un défaut de fabrication, on la refait gratuitement. C\'est notre garantie, sans discussion.' },
    { q: 'Quel est le minimum de commande?', a: 'Une pièce. Sérieusement. Mais les tarifs entreprise deviennent vraiment intéressants dès 51 pièces (−15%) et 200 pièces (jusqu\'à −30%).' },
    { q: 'Comment se passe le paiement?', a: 'Devis clair sous 2h. Paiement par BaridiMob, CCP ou virement. Acompte à la commande, solde validé après les photos de contrôle. Vous ne payez jamais le solde à l\'aveugle.' },
    { q: 'Vous livrez partout en Algérie?', a: 'Oui, les 58 wilayas. Alger en 24h après production, le reste du pays en 2 à 5 jours selon la zone.' },
  ]

  return (
    <div style={{ background: C.black, color: C.white }}>
      <GlobalStyle />

      {/* HEADER */}
      <header>
        <Link href="/"><img src={LOGO} alt="Caractère" /></Link>
        <a href={WA} className="wa-btn">💬 Devis en 2h</a>
      </header>

      {/* HERO — Hormozi: promesse + délai + garantie dans le titre */}
      <section className="hero wrap">
        <div className="reveal">
          <span className="eyebrow">Espace Entreprise — Atelier Alger</span>
          <h1>
            Vos uniformes livrés en <span className="accent">48h.</span><br />
            Validés en photo. <span className="accent">Garantis.</span>
          </h1>
          <p className="sub">
            L'atelier textile qui équipe les restaurants, cliniques et chantiers d'Algérie —
            sans retard, sans surprise, sans "on vous rappelle".
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={WA} className="btn btn-gold">Recevoir ma maquette gratuite →</a>
            <Link href="/configurateur" className="btn btn-ghost">⚙️ Configurer en ligne</Link>
          </div>
          <div className="proofbar">
            <span>✅ <b>500+</b> entreprises équipées</span>
            <span>✅ <b>50 000+</b> pièces produites</span>
            <span>✅ <b>4,9/5</b> de satisfaction</span>
            <span>✅ Réponse en <b>moins de 2h</b></span>
          </div>
        </div>
      </section>

      {/* PROBLÈME — neuromarketing: activer la douleur avant la solution */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">Le vrai coût d'un mauvais fournisseur</p>
          <h2 className="h2 reveal">Un uniforme raté, c'est votre image<br />qui prend le coup. <span className="accent">Pas la nôtre.</span></h2>
          <p className="lead reveal">Si vous avez déjà commandé des tenues personnalisées en Algérie, vous connaissez probablement ça:</p>
          <div className="grid">
            {pains.map((p, i) => (
              <div key={i} className="pain reveal">
                <span className="x">✕</span>
                <p className="title">{p.title}</p>
                <p className="desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION / VALUE STACK */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">Pourquoi 500+ entreprises nous font confiance</p>
          <h2 className="h2 reveal">On a construit l'atelier qu'on aurait<br />voulu avoir <span className="accent">comme client.</span></h2>
          <p className="lead reveal">Chaque point ci-dessous répond à une galère qu'on a entendue des centaines de fois.</p>
          <div className="grid">
            {values.map((v, i) => (
              <div key={i} className="value-card reveal">
                <span className="ico">{v.ico}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
                <span className="val">{v.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — réduire l'effort perçu (value equation) */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">Simple, volontairement</p>
          <h2 className="h2 reveal">De votre logo à vos équipes habillées:<br /><span className="accent">4 étapes, zéro friction.</span></h2>
          <p className="lead reveal">Votre seul travail: envoyer un logo et valider. On s'occupe du reste.</p>
          <div className="steps">
            <div className="step reveal"><div className="num">1</div><h3>Envoyez votre logo</h3><p>Sur WhatsApp ou via le configurateur. 2 minutes, montre en main.</p></div>
            <div className="step reveal"><div className="num">2</div><h3>Validez la maquette</h3><p>Reçue en 2h, gratuite. Devis précis inclus. Modifiable jusqu'à validation.</p></div>
            <div className="step reveal"><div className="num">3</div><h3>On produit en 48h</h3><p>DTF ou broderie dans notre atelier d'Alger. Photos de contrôle envoyées.</p></div>
            <div className="step reveal"><div className="num">4</div><h3>Vous recevez. C'est tout.</h3><p>Livraison 58 wilayas. Designs archivés pour vos futurs réassorts.</p></div>
          </div>
        </div>
      </section>

      {/* PREUVE SOCIALE avec résultats chiffrés */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">Ils ont testé. Ils sont restés.</p>
          <h2 className="h2 reveal">Des résultats, <span className="accent">pas des promesses.</span></h2>
          <div className="grid" style={{ marginTop: 48 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi reveal">
                <div className="stars">★★★★★</div>
                <p className="quote">"{t.quote}"</p>
                <p className="who">{t.who}</p>
                <p className="role">{t.role}</p>
                <span className="result">{t.result}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRE — Grand Slam Offer: stack + valeur + rareté douce */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">L'offre entreprise</p>
          <div className="offer-box reveal">
            <h3>Le Pack Première Commande</h3>
            <p className="sub">Tout ce qu'il faut pour tester notre qualité sans risque:</p>
            <ul className="offer-list">
              <li><span className="check">✓</span><span>Maquette professionnelle en 2h <span className="strike">5 000 DA</span> <b style={{color:C.gold}}>Offerte</b></span></li>
              <li><span className="check">✓</span><span>Production prioritaire 48h garantie par écrit</span></li>
              <li><span className="check">✓</span><span>Photos de contrôle avant expédition</span></li>
              <li><span className="check">✓</span><span>Archivage de vos designs pour réassorts en 1 message</span></li>
              <li><span className="check">✓</span><span>Rabais volume: −15% dès 51 pièces, jusqu'à −30% dès 200</span></li>
              <li><span className="check">✓</span><span>Interlocuteur dédié sur WhatsApp (réponse &lt; 2h, 6j/7)</span></li>
            </ul>
            <a href={WA} className="btn btn-gold" style={{ width: '100%', maxWidth: 380 }}>Démarrer ma première commande →</a>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>⚡ Capacité limitée: nous acceptons 12 nouveaux comptes entreprise par mois pour tenir le 48h.</p>
          </div>
        </div>
      </section>

      {/* GARANTIE — risk reversal Hormozi */}
      <section className="section">
        <div className="wrap">
          <div className="guarantee reveal">
            <span className="shield">🛡️</span>
            <div>
              <h3>La Garantie "Zéro Pièce Ratée"</h3>
              <p>
                Vous validez la maquette avant production. Vous validez les photos avant expédition.
                Et si malgré ces deux contrôles une pièce arrive avec un défaut de fabrication,
                <b style={{ color: C.white }}> on la refait gratuitement, sans débat.</b> Le risque est
                entièrement de notre côté — c'est normal, c'est notre métier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — lever les dernières objections */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">Les questions qu'on nous pose vraiment</p>
          <h2 className="h2 reveal">Tout ce que vous voulez savoir<br />avant de commander.</h2>
          <div className="faq" style={{ marginTop: 44 }}>
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item reveal ${faqOpen === i ? 'active' : ''}`} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                <h3>{f.q}<span className="toggle">{faqOpen === i ? '−' : '+'}</span></h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL — urgence + simplicité */}
      <section className="final">
        <div className="reveal">
          <h2>Votre maquette gratuite<br />vous attend.</h2>
          <p>Envoyez votre logo maintenant. Dans 2h, vous voyez exactement<br />à quoi ressembleront vos équipes. Sans payer. Sans engagement.</p>
          <a href={WA} className="btn btn-gold" style={{ fontSize: 16, padding: '18px 40px' }}>💬 Envoyer mon logo sur WhatsApp</a>
          <p className="micro">Réponse en moins de 2h, 6j/7 • +213 557 440 522</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <img src={LOGO} alt="Caractère" />
        <p>© 2026 Caractère Store • Uniformes & Branding B2B • Atelier Alger • Livraison 58 wilayas</p>
        <p style={{ marginTop: 10 }}>📞 +213 557 440 522 • 📧 yakoumobi@gmail.com</p>
      </footer>
    </div>
  )
}
