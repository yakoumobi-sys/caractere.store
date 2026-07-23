'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const C = {
  black: '#0C0A09',
  dark: '#111113',
  white: '#FAFAF9',
  lime: '#A3E635',
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
    header .cta-nav {
      background: ${C.lime}; color: ${C.black};
      padding: 10px 18px; border-radius: 8px;
      font-weight: 800; font-size: 13px; text-decoration: none;
      transition: transform .25s;
    }
    header .cta-nav:hover { transform: translateY(-2px); }

    .wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    .hero { padding: 90px 0 70px; text-align: center; position: relative; }
    .hero .eyebrow {
      display: inline-block;
      border: 1px solid rgba(163,230,53,.4);
      color: ${C.lime};
      padding: 6px 16px; border-radius: 999px;
      font-size: 12px; font-weight: 800; letter-spacing: 2px;
      text-transform: uppercase; margin-bottom: 28px;
    }
    .hero h1 {
      font-size: clamp(34px, 6.5vw, 66px);
      font-weight: 900; line-height: 1.08;
      margin-bottom: 22px; letter-spacing: -1px;
    }
    .hero h1 .accent { color: ${C.lime}; }
    .hero .sub {
      font-size: 18px; color: ${C.muted};
      max-width: 620px; margin: 0 auto 36px; font-weight: 600;
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      padding: 16px 32px; border-radius: 10px;
      font-weight: 800; font-size: 15px;
      text-decoration: none; cursor: pointer;
      transition: transform .25s, box-shadow .3s; border: none;
    }
    .btn:hover { transform: translateY(-3px); }
    .btn-lime { background: ${C.lime}; color: ${C.black}; box-shadow: 0 12px 34px -12px rgba(163,230,53,.45); }
    .btn-ghost { border: 1.5px solid rgba(250,250,249,.25); color: ${C.white}; background: transparent; }
    .btn-ghost:hover { border-color: ${C.lime}; color: ${C.lime}; }

    .proofbar {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;
      margin-top: 44px; font-size: 13px; color: ${C.muted}; font-weight: 700;
    }
    .proofbar span { display: flex; align-items: center; gap: 7px; }
    .proofbar b { color: ${C.white}; }

    .section { padding: 80px 0; }
    .section-dark { background: ${C.dark}; }
    .kicker { color: ${C.lime}; font-size: 12px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 14px; text-align: center; }
    .h2 { font-size: clamp(28px, 4.5vw, 44px); font-weight: 900; text-align: center; line-height: 1.15; margin-bottom: 18px; letter-spacing: -0.5px; }
    .h2 .accent { color: ${C.lime}; }
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

    .math-box {
      background: rgba(163,230,53,.06);
      border: 1.5px solid rgba(163,230,53,.35);
      border-radius: 18px; padding: 34px 28px;
      max-width: 680px; margin: 0 auto; text-align: center;
    }
    .math-box h3 { font-size: 20px; font-weight: 900; margin-bottom: 20px; }
    .math-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid rgba(250,250,249,.08); font-size: 14px; font-weight: 700; }
    .math-row .lbl { color: ${C.muted}; }
    .math-row .num { font-weight: 900; }
    .math-row.total { border: none; padding-top: 18px; }
    .math-row.total .num { color: ${C.lime}; font-size: 20px; }

    .value-card {
      background: rgba(250,250,249,.04);
      border: 1px solid rgba(250,250,249,.09);
      border-radius: 16px; padding: 30px 26px;
      transition: transform .3s, border-color .3s;
    }
    .value-card:hover { transform: translateY(-5px); border-color: rgba(163,230,53,.45); }
    .value-card .ico { font-size: 30px; margin-bottom: 16px; display: block; }
    .value-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 8px; }
    .value-card p { font-size: 13px; color: ${C.muted}; }
    .value-card .val { display: inline-block; margin-top: 14px; color: ${C.lime}; font-size: 12px; font-weight: 800; }

    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
    .step {
      background: rgba(250,250,249,.03);
      border: 1px solid rgba(250,250,249,.08);
      border-radius: 14px; padding: 28px 24px;
    }
    .step .num {
      width: 40px; height: 40px; border-radius: 10px;
      background: rgba(163,230,53,.14); color: ${C.lime};
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
    .testi .stars { color: ${C.lime}; letter-spacing: 2px; margin-bottom: 14px; font-size: 14px; }
    .testi .quote { font-size: 14px; line-height: 1.8; margin-bottom: 18px; color: ${C.white}; }
    .testi .who { font-weight: 800; font-size: 13px; }
    .testi .role { font-size: 12px; color: ${C.muted}; font-weight: 700; }
    .testi .result { display: inline-block; margin-top: 12px; background: rgba(163,230,53,.12); color: ${C.lime}; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; }

    .offer-box {
      background: linear-gradient(160deg, rgba(163,230,53,.12) 0%, rgba(250,250,249,.03) 60%);
      border: 1.5px solid rgba(163,230,53,.45);
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
    .offer-list li .check { color: ${C.lime}; font-weight: 900; }

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
    .faq-item .toggle { color: ${C.lime}; font-weight: 900; }
    .faq-item p { font-size: 14px; color: ${C.muted}; line-height: 1.8; margin-top: 12px; display: none; }
    .faq-item.active p { display: block; }

    .final {
      text-align: center; padding: 90px 24px;
      background: linear-gradient(160deg, rgba(163,230,53,.1) 0%, ${C.black} 65%);
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

export default function PrintOnDemandPage() {
  useReveal()
  const [faqOpen, setFaqOpen] = useState(0)

  const pains = [
    { title: '"Il faut commander 100 pièces minimum"', desc: 'Résultat: 200 000 DA bloqués dans des cartons avant même ta première vente.' },
    { title: '6 semaines d\'attente depuis la Chine', desc: 'Ta hype est morte avant que le stock arrive. Et la qualité? Loterie.' },
    { title: 'Le stock invendu qui dort', desc: 'Les tailles M partent, les XL restent. Ton argent aussi.' },
    { title: '"Je lancerai quand j\'aurai le budget"', desc: 'La phrase qui tue 90% des marques avant leur naissance.' },
  ]

  const values = [
    { ico: '📦', title: 'Zéro stock, zéro risque', desc: 'Tu vends d\'abord. On produit ensuite. Ton client paie avant que tu dépenses 1 dinar en production.', val: 'Trésorerie protégée à 100%' },
    { ico: '⚡', title: 'Production 48h à Alger', desc: 'Ton client commande lundi, sa pièce part mercredi. Pas de Chine, pas de douane, pas d\'excuses.', val: 'Le plus rapide d\'Algérie' },
    { ico: '🎨', title: 'Designer en ligne gratuit', desc: 'Crée ton design directement dans ton navigateur. Textes, images, positionnement. Aucun logiciel à payer.', val: 'Valeur: 15 000 DA/an — offert' },
    { ico: '🧊', title: 'Studio 3D', desc: 'Visualise ton t-shirt en 3D avant de produire. Exporte des visuels pro pour ton Instagram sans shooting photo.', val: 'Contenu marketing gratuit' },
    { ico: '💎', title: 'Qualité DTF premium', desc: 'Impression haute résolution qui tient 50+ lavages. Tes clients reviennent au lieu de réclamer.', val: 'Taux de retour < 1%' },
    { ico: '🔁', title: 'De 1 à 1 000 pièces', desc: 'Commence avec 1 pièce test. Scale quand ça vend. Le prix baisse quand le volume monte.', val: 'Tu grandis, on suit' },
  ]

  const testimonials = [
    { quote: "J'ai lancé ma marque avec 3 designs et zéro dinar de stock. Premier mois: 47 ventes. Chaque commande part en production après le paiement client. Je n'aurais jamais pu démarrer autrement.", who: 'Leila M.', role: 'Fondatrice — marque streetwear', result: '47 ventes le 1er mois • 0 DA de stock' },
    { quote: 'Le Studio 3D m\'a sauvé mon lancement Instagram. Des visuels 3D propres sans payer de shooting. 50 hoodies vendus en précommande avant de produire quoi que ce soit.', who: 'Ahmed B.', role: 'Créateur de contenu', result: '50 hoodies en précommande' },
    { quote: 'Qualité DTF vraiment au-dessus. Mes clients postent leurs pièces en story sans que je demande. C\'est devenu ma meilleure pub.', who: 'Zainab A.', role: 'Designer indépendante', result: 'UGC gratuit • clients fidèles' },
  ]

  const faqs = [
    { q: 'Combien ça coûte pour démarrer?', a: 'Le prix d\'une seule pièce: 1 950 DA. C\'est tout. Pas d\'abonnement, pas de frais cachés, pas de minimum. Tu peux littéralement tester ta marque avec le prix d\'un resto.' },
    { q: 'Je ne sais pas designer. C\'est un problème?', a: 'Non. Le Designer en ligne est fait pour les débutants: tu ajoutes ton texte, ton image, tu positionnes, c\'est prêt. Et si tu bloques, envoie-nous ton idée sur WhatsApp — on t\'aide gratuitement à la mettre au propre.' },
    { q: 'Comment je gagne de l\'argent concrètement?', a: 'Exemple réel: ton t-shirt te coûte 1 950 DA production incluse. Tu le vends 3 500-4 500 DA (prix marché streetwear DZ). Marge: 1 550 à 2 550 DA par pièce, sans avoir avancé de stock. 20 ventes/mois = 31 000 à 51 000 DA de bénéfice.' },
    { q: 'Qui gère la livraison au client final?', a: 'Toi ou nous, au choix. On peut expédier directement à ton client dans les 58 wilayas, ou te livrer le lot pour que tu gères ta propre expérience de marque.' },
    { q: 'Et si la qualité ne me plaît pas?', a: 'Commande 1 pièce test. Si le rendu ne te convient pas, on la refait ou on te rembourse. Tu risques 0 DA pour vérifier notre qualité avant de lancer ta marque dessus.' },
    { q: 'Je peux voir le produit avant de vendre?', a: 'Oui, et tu DOIS: commande ta pièce échantillon, prends tes photos, lance tes précommandes avec. C\'est exactement comme ça que nos meilleurs créateurs démarrent.' },
  ]

  return (
    <div style={{ background: C.black, color: C.white }}>
      <GlobalStyle />

      {/* HEADER */}
      <header>
        <Link href="/"><img src={LOGO} alt="Caractère" /></Link>
        <Link href="/designer" className="cta-nav">🎨 Créer mon design</Link>
      </header>

      {/* HERO — dream outcome + délai + zéro risque */}
      <section className="hero wrap">
        <div className="reveal in">
          <span className="eyebrow">Print on Demand — Alger</span>
          <h1>
            Lance ta marque <span className="accent">cette semaine.</span><br />
            Sans stock. <span className="accent">Sans risque.</span>
          </h1>
          <p className="sub">
            Tu designs. Ton client commande. On produit en 48h et on livre.
            Toi, tu encaisses la marge — sans avoir avancé un dinar de stock.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/designer" className="btn btn-lime">🎨 Créer mon premier design →</Link>
            <a href={WA} className="btn btn-ghost">💬 Parler à un humain</a>
          </div>
          <div className="proofbar">
            <span>✅ <b>500+</b> marques lancées</span>
            <span>✅ <b>50 000+</b> pièces produites</span>
            <span>✅ Production <b>48h</b></span>
            <span>✅ Dès <b>1 pièce</b></span>
          </div>
        </div>
      </section>

      {/* PROBLÈME — la vraie raison pour laquelle les marques ne se lancent pas */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">Pourquoi 90% des marques ne voient jamais le jour</p>
          <h2 className="h2 reveal">Ce n'est pas le talent qui te manque.<br /><span className="accent">C'est le modèle qui est cassé.</span></h2>
          <p className="lead reveal">L'ancienne façon de lancer une marque de vêtements en Algérie:</p>
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

      {/* LE CALCUL — neuromarketing: rendre le gain concret et chiffré */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">Le nouveau modèle</p>
          <h2 className="h2 reveal">Fais le calcul <span className="accent">toi-même.</span></h2>
          <p className="lead reveal">Voici les vrais chiffres d'une vente en Print on Demand avec Caractère:</p>
          <div className="math-box reveal">
            <h3>💰 Ta marge par t-shirt</h3>
            <div className="math-row"><span className="lbl">Prix de vente (marché streetwear DZ)</span><span className="num">4 000 DA</span></div>
            <div className="math-row"><span className="lbl">Production + impression DTF (nous)</span><span className="num">− 1 950 DA</span></div>
            <div className="math-row"><span className="lbl">Stock avancé par toi</span><span className="num">0 DA</span></div>
            <div className="math-row total"><span className="lbl" style={{ color: C.white, fontWeight: 900 }}>Ta marge nette par pièce</span><span className="num">+2 050 DA</span></div>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 18 }}>
              20 ventes/mois = <b style={{ color: C.white }}>41 000 DA</b> de bénéfice.
              100 ventes = <b style={{ color: C.lime }}>205 000 DA</b>. Sans local, sans stock, sans salarié.
            </p>
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">Tout ce qu'il te faut, rien de superflu</p>
          <h2 className="h2 reveal">On a enlevé toutes les raisons<br />de <span className="accent">ne pas te lancer.</span></h2>
          <div className="grid" style={{ marginTop: 48 }}>
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

      {/* PROCESS */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">De l'idée à la vente</p>
          <h2 className="h2 reveal">Ta marque en ligne en <span className="accent">4 étapes.</span></h2>
          <p className="lead reveal">Certains créateurs font les 4 dans la même journée.</p>
          <div className="steps">
            <div className="step reveal"><div className="num">1</div><h3>Crée ton design</h3><p>Designer en ligne gratuit. Ou envoie ton idée, on la met au propre.</p></div>
            <div className="step reveal"><div className="num">2</div><h3>Commande ta pièce test</h3><p>1 950 DA. Vérifie la qualité, prends tes photos, poste sur Insta.</p></div>
            <div className="step reveal"><div className="num">3</div><h3>Vends d'abord</h3><p>Précommandes en DM ou story. Ton client paie AVANT la production.</p></div>
            <div className="step reveal"><div className="num">4</div><h3>On produit, tu encaisses</h3><p>48h de production, livraison 58 wilayas. Ta marge reste dans ta poche.</p></div>
          </div>
        </div>
      </section>

      {/* PREUVE SOCIALE */}
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">Ils ont commencé exactement comme toi</p>
          <h2 className="h2 reveal">Zéro stock au départ.<br /><span className="accent">De vraies ventes à l'arrivée.</span></h2>
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

      {/* OFFRE — Grand Slam Offer */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">L'offre de lancement</p>
          <div className="offer-box reveal">
            <h3>Le Pack Créateur</h3>
            <p className="sub">Tout pour lancer ta marque aujourd'hui — pour le prix d'une seule pièce:</p>
            <ul className="offer-list">
              <li><span className="check">✓</span><span>Ta première pièce produite en qualité DTF premium — <b>1 950 DA</b></span></li>
              <li><span className="check">✓</span><span>Designer en ligne illimité <b style={{ color: C.lime }}>(offert)</b></span></li>
              <li><span className="check">✓</span><span>Studio 3D pour tes visuels Instagram <b style={{ color: C.lime }}>(offert)</b></span></li>
              <li><span className="check">✓</span><span>Aide au design sur WhatsApp si tu bloques <b style={{ color: C.lime }}>(offert)</b></span></li>
              <li><span className="check">✓</span><span>Ton design archivé — chaque revente part en prod en 1 message</span></li>
              <li><span className="check">✓</span><span>Prix dégressifs automatiques quand tu scales</span></li>
            </ul>
            <Link href="/designer" className="btn btn-lime" style={{ width: '100%', maxWidth: 380 }}>Lancer ma marque maintenant →</Link>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>💡 Le seul "investissement" est ta pièce test à 1 950 DA — remboursée si la qualité ne te convient pas.</p>
          </div>
        </div>
      </section>

      {/* GARANTIE — risk reversal */}
      <section className="section section-dark">
        <div className="wrap">
          <div className="guarantee reveal">
            <span className="shield">🛡️</span>
            <div>
              <h3>La Garantie "Pièce Test Sans Risque"</h3>
              <p>
                Commande ta première pièce. Si la qualité d'impression ne correspond pas à ce que tu
                attendais, <b style={{ color: C.white }}>on la refait ou on te rembourse intégralement.</b> Tu
                vérifies notre qualité avant de construire ta marque dessus — c'est toi qui décides,
                preuve en main.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">Les vraies questions des créateurs</p>
          <h2 className="h2 reveal">Tout ce que tu te demandes<br />avant de te lancer.</h2>
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

      {/* CTA FINAL — coût de l'inaction */}
      <section className="final">
        <div className="reveal">
          <h2>Dans 6 mois, tu auras une marque.<br />Ou une excuse.</h2>
          <p>Ton premier design prend 10 minutes. Ta pièce test coûte moins qu'un resto.<br />La seule chose que tu risques vraiment, c'est de ne jamais essayer.</p>
          <Link href="/designer" className="btn btn-lime" style={{ fontSize: 16, padding: '18px 40px' }}>🎨 Créer mon premier design →</Link>
          <p className="micro">Gratuit • Sans compte requis pour essayer • Aide humaine sur WhatsApp: +213 557 440 522</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <img src={LOGO} alt="Caractère" />
        <p>© 2026 Caractère Store • Print on Demand • DTF Premium • Production 48h • Alger — 58 wilayas</p>
        <p style={{ marginTop: 10 }}>📞 +213 557 440 522 • 📧 yakoumobi@gmail.com</p>
      </footer>
    </div>
  )
}
