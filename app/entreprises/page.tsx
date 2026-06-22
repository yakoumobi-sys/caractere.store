<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Offres Entreprises – Caractère Store</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0E0E0E;
    --cream: #F7F4EF;
    --gold: #C8A84B;
    --gold-light: #E8C96A;
    --gold-dim: rgba(200,168,75,0.15);
    --mid: #6B6B6B;
    --border: rgba(14,14,14,0.1);
    --white: #FFFFFF;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* NAV */
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    border-bottom: 1px solid var(--border);
    background: var(--cream);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.2rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink);
    text-decoration: none;
  }
  .logo span { color: var(--gold); }
  nav a.cta-nav {
    font-size: 0.82rem;
    font-weight: 500;
    color: var(--ink);
    text-decoration: none;
    border: 1px solid var(--ink);
    padding: 8px 18px;
    letter-spacing: 0.06em;
    transition: all 0.2s;
  }
  nav a.cta-nav:hover { background: var(--ink); color: var(--cream); }

  /* HERO */
  .hero {
    padding: 80px 40px 60px;
    max-width: 900px;
    margin: 0 auto;
  }
  .eyebrow {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
  }
  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.05;
    color: var(--ink);
    margin-bottom: 24px;
  }
  .hero h1 em {
    font-style: normal;
    color: var(--gold);
  }
  .hero p {
    font-size: 1.05rem;
    font-weight: 300;
    color: var(--mid);
    max-width: 560px;
    line-height: 1.7;
  }

  /* SAVINGS TICKER */
  .savings-bar {
    background: var(--ink);
    color: var(--cream);
    padding: 12px 40px;
    display: flex;
    align-items: center;
    gap: 32px;
    overflow: hidden;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .savings-bar .dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* PACKS SECTION */
  .packs {
    padding: 60px 40px 80px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .pack-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: start;
  }

  .pack-card {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 36px 32px;
    position: relative;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .pack-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(14,14,14,0.08);
  }
  .pack-card.featured {
    background: var(--ink);
    color: var(--cream);
    border-color: var(--ink);
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(14,14,14,0.18);
  }
  .pack-card.featured:hover {
    transform: translateY(-12px);
  }

  .badge {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 4px 10px;
    margin-bottom: 20px;
  }
  .badge.gold { background: var(--gold-dim); color: var(--gold); }
  .badge.white { background: rgba(247,244,239,0.12); color: var(--gold-light); }

  .badge-popular {
    position: absolute;
    top: -1px;
    right: 24px;
    background: var(--gold);
    color: var(--ink);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 12px;
  }

  .pack-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .pack-subtitle {
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--mid);
    margin-bottom: 28px;
    line-height: 1.5;
  }
  .pack-card.featured .pack-subtitle { color: rgba(247,244,239,0.55); }

  .price-block { margin-bottom: 28px; }
  .price-real {
    font-size: 0.78rem;
    font-weight: 400;
    text-decoration: line-through;
    color: var(--mid);
    margin-bottom: 4px;
  }
  .pack-card.featured .price-real { color: rgba(247,244,239,0.4); }
  .price-main {
    font-family: 'Syne', sans-serif;
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1;
    color: var(--ink);
  }
  .pack-card.featured .price-main { color: var(--gold-light); }
  .price-unit {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--mid);
    margin-top: 4px;
  }
  .pack-card.featured .price-unit { color: rgba(247,244,239,0.5); }

  .savings-pill {
    display: inline-block;
    background: var(--gold-dim);
    color: var(--gold);
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 10px;
    margin-top: 8px;
  }
  .pack-card.featured .savings-pill {
    background: rgba(200,168,75,0.2);
    color: var(--gold-light);
  }

  .divider {
    height: 1px;
    background: var(--border);
    margin: 24px 0;
  }
  .pack-card.featured .divider { background: rgba(247,244,239,0.1); }

  .items-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--mid);
    margin-bottom: 14px;
  }
  .pack-card.featured .items-label { color: rgba(247,244,239,0.45); }

  .item-list { list-style: none; }
  .item-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    font-weight: 300;
    padding: 6px 0;
    border-bottom: 1px solid var(--border);
    gap: 12px;
  }
  .pack-card.featured .item-list li { border-color: rgba(247,244,239,0.08); }
  .item-list li:last-child { border-bottom: none; }
  .item-name { color: inherit; }
  .item-qty {
    font-weight: 500;
    font-size: 0.78rem;
    flex-shrink: 0;
    color: var(--gold);
  }
  .pack-card.featured .item-qty { color: var(--gold-light); }

  .pack-total {
    margin-top: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--mid);
  }
  .pack-card.featured .pack-total { color: rgba(247,244,239,0.5); }

  .cta-pack {
    display: block;
    text-align: center;
    margin-top: 28px;
    padding: 14px 20px;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    width: 100%;
  }
  .cta-pack.dark { background: var(--ink); color: var(--cream); }
  .cta-pack.dark:hover { background: #2a2a2a; }
  .cta-pack.light { background: var(--gold); color: var(--ink); }
  .cta-pack.light:hover { background: var(--gold-light); }

  /* FEATURES */
  .features {
    background: var(--ink);
    color: var(--cream);
    padding: 60px 40px;
  }
  .features-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .features h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 40px;
    color: var(--cream);
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
  .feature-item {}
  .feature-icon {
    font-size: 1.4rem;
    margin-bottom: 12px;
  }
  .feature-title {
    font-size: 0.88rem;
    font-weight: 600;
    margin-bottom: 6px;
    color: var(--cream);
  }
  .feature-desc {
    font-size: 0.78rem;
    font-weight: 300;
    color: rgba(247,244,239,0.5);
    line-height: 1.6;
  }

  /* FAQ / CTA BOTTOM */
  .bottom-cta {
    padding: 80px 40px;
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
  }
  .bottom-cta h2 {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 16px;
    line-height: 1.15;
  }
  .bottom-cta p {
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--mid);
    margin-bottom: 36px;
    line-height: 1.7;
  }
  .btn-wa {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #25D366;
    color: #fff;
    padding: 16px 32px;
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-decoration: none;
    transition: all 0.2s;
  }
  .btn-wa:hover { background: #1ebe5d; transform: translateY(-2px); }
  .btn-wa svg { width: 20px; height: 20px; fill: #fff; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .pack-grid { grid-template-columns: 1fr; gap: 16px; }
    .pack-card.featured { transform: none; }
    .pack-card.featured:hover { transform: translateY(-4px); }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    nav { padding: 16px 20px; }
    .hero, .packs, .features { padding-left: 20px; padding-right: 20px; }
    .bottom-cta { padding: 60px 20px; }
  }
  @media (max-width: 480px) {
    .features-grid { grid-template-columns: 1fr; }
    .hero h1 { font-size: 2rem; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="/" class="logo">Caract<span>è</span>re</a>
  <a href="https://wa.me/213557440522" class="cta-nav">Demander un devis</a>
</nav>

<!-- HERO -->
<header class="hero">
  <p class="eyebrow">Solutions entreprises</p>
  <h1>Équipez votre équipe.<br><em>Sans compromis.</em></h1>
  <p>Des packs clés-en-main pour habiller votre personnel, vos événements et vos équipes. Livraison à Alger, personnalisation incluse.</p>
</header>

<!-- SAVINGS BAR -->
<div class="savings-bar">
  <div class="dot"></div>
  <span>Économisez jusqu'à 4 800 DA sur le Pack Business</span>
  <div class="dot"></div>
  <span>Broderie &amp; DTF incluses</span>
  <div class="dot"></div>
  <span>Délai : 5–7 jours ouvrés</span>
  <div class="dot"></div>
  <span>Devis personnalisé disponible</span>
</div>

<!-- PACKS -->
<section class="packs">
  <div class="pack-grid">

    <!-- STARTER -->
    <div class="pack-card">
      <span class="badge gold">Starter</span>
      <div class="pack-name">Pack Starter</div>
      <div class="pack-subtitle">Idéal pour équipes, petites entreprises &amp; événements</div>

      <div class="price-block">
        <div class="price-real">Valeur réelle : 20 800 DA</div>
        <div class="price-main">19 900 <small style="font-size:1rem;font-weight:500">DA</small></div>
        <div class="price-unit">10 articles personnalisés</div>
        <span class="savings-pill">Vous économisez 900 DA</span>
      </div>

      <div class="divider"></div>

      <div class="items-label">Contenu du pack</div>
      <ul class="item-list">
        <li><span class="item-name">T-shirts personnalisés</span><span class="item-qty">×4</span></li>
        <li><span class="item-name">Casquettes</span><span class="item-qty">×2</span></li>
        <li><span class="item-name">Polos</span><span class="item-qty">×4</span></li>
      </ul>
      <div class="pack-total">10 articles au total</div>

      <a href="https://wa.me/213557440522?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Pack%20Starter%20(19%20900%20DA).%20Pouvez-vous%20me%20donner%20plus%20d%27informations%20%3F" class="cta-pack dark" target="_blank">
        Commander ce pack
      </a>
    </div>

    <!-- PRO (FEATURED) -->
    <div class="pack-card featured">
      <span class="badge-popular">⭐ Populaire</span>
      <span class="badge white">Pro</span>
      <div class="pack-name">Pack Pro</div>
      <div class="pack-subtitle">Pour petites entreprises, équipes terrain &amp; staff complet</div>

      <div class="price-block">
        <div class="price-real">Valeur réelle : 53 000 DA</div>
        <div class="price-main">49 900 <small style="font-size:1rem;font-weight:500">DA</small></div>
        <div class="price-unit">25 articles personnalisés</div>
        <span class="savings-pill">Vous économisez 3 100 DA</span>
      </div>

      <div class="divider"></div>

      <div class="items-label">Contenu du pack</div>
      <ul class="item-list">
        <li><span class="item-name">T-shirts personnalisés</span><span class="item-qty">×10</span></li>
        <li><span class="item-name">Polos</span><span class="item-qty">×6</span></li>
        <li><span class="item-name">Gilets</span><span class="item-qty">×4</span></li>
        <li><span class="item-name">Casquettes</span><span class="item-qty">×5</span></li>
      </ul>
      <div class="pack-total">25 articles au total</div>

      <a href="https://wa.me/213557440522?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Pack%20Pro%2025%20articles%20(49%20900%20DA).%20Pouvez-vous%20me%20donner%20plus%20d%27informations%20%3F" class="cta-pack light" target="_blank">
        Commander ce pack
      </a>
    </div>

    <!-- BUSINESS -->
    <div class="pack-card">
      <span class="badge gold">Business</span>
      <div class="pack-name">Pack Business</div>
      <div class="pack-subtitle">Pour entreprises, grands événements &amp; staff complet</div>

      <div class="price-block">
        <div class="price-real">Valeur réelle : 84 700 DA</div>
        <div class="price-main">79 900 <small style="font-size:1rem;font-weight:500">DA</small></div>
        <div class="price-unit">40 articles personnalisés</div>
        <span class="savings-pill">Vous économisez 4 800 DA</span>
      </div>

      <div class="divider"></div>

      <div class="items-label">Contenu du pack</div>
      <ul class="item-list">
        <li><span class="item-name">T-shirts personnalisés</span><span class="item-qty">×16</span></li>
        <li><span class="item-name">Polos</span><span class="item-qty">×10</span></li>
        <li><span class="item-name">Gilets</span><span class="item-qty">×6</span></li>
        <li><span class="item-name">Casquettes</span><span class="item-qty">×8</span></li>
      </ul>
      <div class="pack-total">40 articles au total</div>

      <a href="https://wa.me/213557440522?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20le%20Pack%20Business%2040%20articles%20(79%20900%20DA).%20Pouvez-vous%20me%20donner%20plus%20d%27informations%20%3F" class="cta-pack dark" target="_blank">
        Commander ce pack
      </a>
    </div>

  </div>
</section>

<!-- FEATURES -->
<section class="features">
  <div class="features-inner">
    <h2>Pourquoi choisir Caractère Store ?</h2>
    <div class="features-grid">
      <div class="feature-item">
        <div class="feature-icon">🎨</div>
        <div class="feature-title">Personnalisation totale</div>
        <div class="feature-desc">Logo, couleurs, texte — chaque article est imprimé ou brodé selon votre identité.</div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">⚡</div>
        <div class="feature-title">Délai rapide</div>
        <div class="feature-desc">Production en atelier à Alger. Livraison sous 5 à 7 jours ouvrés.</div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🏭</div>
        <div class="feature-title">Fait en Algérie</div>
        <div class="feature-desc">Atelier local, contrôle qualité sur chaque commande, sans intermédiaire.</div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">📦</div>
        <div class="feature-title">Devis sur mesure</div>
        <div class="feature-desc">Besoin de plus ? On adapte le pack selon vos quantités et votre budget.</div>
      </div>
    </div>
  </div>
</section>

<!-- BOTTOM CTA -->
<section class="bottom-cta">
  <h2>Un besoin spécifique ?<br>On vous fait un devis.</h2>
  <p>Quantités différentes, articles hors catalogue, délai urgent — contactez-nous sur WhatsApp et obtenez une réponse sous 2h.</p>
  <a href="https://wa.me/213557440522?text=Bonjour%2C%20j%27aimerais%20obtenir%20un%20devis%20personnalis%C3%A9%20pour%20ma%20commande%20entreprise." class="btn-wa" target="_blank">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Discuter sur WhatsApp
  </a>
</section>

</body>
</html>
