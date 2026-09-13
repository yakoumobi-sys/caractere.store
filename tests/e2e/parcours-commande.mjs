// Recette du parcours de commande — les scénarios demandés à la livraison.
//
// Lancer le site (npm run build && npm start), puis :
//   BASE=http://localhost:3000 node tests/e2e/parcours-commande.mjs
//
// Playwright n'est pas une dépendance du projet (il n'est pas nécessaire pour
// construire ni déployer le site) : installez-le à part, ou utilisez celui de
// votre machine — `npx playwright install chromium` si besoin.
//
// Les requêtes sortantes sont coupées pendant le test : les photos du CDN
// externe ne doivent pas faire échouer une recette de parcours.

import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3100'
const resultats = []
const ok = (nom, detail='') => { resultats.push(['OK  ', nom, detail]) }
const ko = (nom, detail='') => { resultats.push(['ECHEC', nom, detail]) }

const nav = chromium
const PAUSE = 700
const browser = await nav.launch()

async function page(width = 1440) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const p = await ctx.newPage()
  p.on('pageerror', e => console.log('  [pageerror]', e.message))
  await p.route('**/*', route => {
    const u = route.request().url()
    if (u.startsWith(BASE) || u.startsWith('data:') || u.startsWith('blob:')) return route.continue()
    return route.abort()
  })
  return p
}

// ── 1. Ensemble 3 pièces → bon produit et bon prix ────────────────
{
  const p = await page()
  await p.goto(`${BASE}/produits`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  const lien = p.locator('article', { hasText: 'ENSEMBLE 3 PIÈCES' }).getByRole('link', { name: /Configurer ma commande/i }).first()
  const href = await lien.getAttribute('href')
  await lien.click()
  // Navigation douce : on attend que le résumé reflète la pièce cliquée.
  await p.locator('aside').getByText('ENSEMBLE 3 PIÈCES').first().waitFor({ timeout: 10000 }).catch(() => {})
  const url = p.url()
  const titre = await p.locator('h1').first().innerText()
  const resume = await p.locator('aside').innerText()
  const produitOk = resume.includes('ENSEMBLE 3 PIÈCES')
  const prixOk = resume.includes('5 000') || resume.includes('5 000 DA') || /5 000|5\s000/.test(resume)
  const etape2 = titre.includes('Options')
  const pasDeFauxImport = !(await p.locator('text=Logo importé depuis le Designer').count())
  if (produitOk && etape2 && pasDeFauxImport) ok('1. Ensemble 3 pièces → bon produit', `href=${href} url=${url.split('?')[1]}`)
  else ko('1. Ensemble 3 pièces', `produit=${produitOk} etape2=${etape2} sansFauxImport=${pasDeFauxImport}`)
  if (prixOk) ok('1b. Prix 5 000 DA repris dans le résumé')
  else ko('1b. Prix', resume.replace(/\n/g,' | ').slice(0,300))
  await p.context().close()
}

// ── 2. Produit inconnu → message clair, aucune progression ────────
{
  const p = await page()
  await p.goto(`${BASE}/configurateur?produit=produit-qui-nexiste-pas`, { waitUntil: 'domcontentloaded' })
  // Le verdict « introuvable » n'est rendu qu'une fois le chargement du
  // catalogue terminé (borné côté application) : on lui laisse ce délai.
  const bandeau = p.locator('[role="alert"]:not(#__next-route-announcer__)').filter({ hasText: /introuvable/i })
  await bandeau.first().waitFor({ timeout: 10000 }).catch(() => {})
  const titre = await p.locator('h1').first().innerText()
  const alerte = await bandeau.first().innerText().catch(() => '')
  const resteEtape1 = /produit/i.test(titre) && !/Options/i.test(titre)
  const explique = /introuvable/i.test(alerte)
  if (resteEtape1 && explique) ok('2. Produit inconnu → explication, reste à l’étape 1', alerte.split('\n')[0])
  else ko('2. Produit inconnu', `titre="${titre}" alerte="${alerte.slice(0,120)}"`)
  await p.context().close()
}

// ── 2b. Ancien lien par nom → résout toujours ─────────────────────
{
  const p = await page()
  await p.goto(`${BASE}/configurateur?produit=${encodeURIComponent('ENSEMBLE 3 PIÈCES')}`, { waitUntil: 'domcontentloaded' })
  await p.locator('aside').getByText('ENSEMBLE 3 PIÈCES').first().waitFor({ timeout: 10000 }).catch(() => {})
  const resume = await p.locator('aside').innerText()
  if (resume.includes('ENSEMBLE 3 PIÈCES')) ok('2b. Ancien lien par nom → résout')
  else ko('2b. Ancien lien par nom', resume.slice(0,200))
  await p.context().close()
}

// ── 3. Plusieurs tailles → quantités et total cohérents ───────────
{
  const p = await page()
  await p.goto(`${BASE}/configurateur?produit=ensemble-3-pieces`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  const champ = t => p.getByLabel(new RegExp(`Quantité en ${t}$`))
  await champ('S').fill('4')
  await champ('M').fill('10')
  await champ('L').fill('6')
  await p.waitForTimeout(300)
  const total = await p.locator('aside').innerText()
  const totalPieces = await p.getByText('Total pièces').locator('..').innerText()
  const attendu = 20 * 5000
  const montantOk = /100\s?000|100 000/.test(total)
  const qteOk = /20/.test(totalPieces)
  const detailOk = total.includes('S × 4') && total.includes('M × 10') && total.includes('L × 6')
  if (montantOk && qteOk && detailOk) ok('3. Plusieurs tailles → 20 pièces, 100 000 DA', 'S×4, M×10, L×6')
  else ko('3. Plusieurs tailles', `qte=${qteOk} montant=${montantOk} detail=${detailOk} :: ${total.replace(/\n/g,' | ').slice(0,300)}`)
  await p.context().close()
}

// ── 4. Retour entre étapes → saisies conservées ───────────────────
{
  const p = await page()
  await p.goto(`${BASE}/configurateur?produit=ensemble-3-pieces`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  await p.getByLabel(/Quantité en M$/).fill('7')
  await p.getByRole('button', { name: /Broderie/ }).click()
  await p.getByRole('button', { name: /Continuer/ }).first().click()      // → 3 Logo
  await p.getByRole('button', { name: /Passer cette étape|Continuer/ }).first().click() // → 4 Contact
  await p.getByLabel(/Nom complet/).fill('Yacine Test')
  await p.getByLabel(/^Téléphone/).fill('0557440522')
  await p.getByRole('button', { name: /Retour/ }).first().click()          // → 3
  await p.getByRole('button', { name: /Retour/ }).first().click()          // → 2
  const qte = await p.getByLabel(/Quantité en M$/).inputValue()
  const technique = await p.locator('aside').innerText()
  await p.getByRole('button', { name: /Continuer/ }).first().click()
  await p.getByRole('button', { name: /Passer cette étape|Continuer/ }).first().click()
  const nom = await p.getByLabel(/Nom complet/).inputValue()
  const tel = await p.getByLabel(/^Téléphone/).inputValue()
  if (qte === '7' && nom === 'Yacine Test' && tel === '0557440522' && technique.includes('Broderie'))
    ok('4. Retour entre étapes → saisies conservées', `qté=${qte}, nom="${nom}", tél=${tel}, technique=Broderie`)
  else ko('4. Retour entre étapes', `qté=${qte} nom="${nom}" tél="${tel}" technique inclus=${technique.includes('Broderie')}`)
  await p.context().close()
}

// ── 5. Échec d’enregistrement → aucune fausse confirmation ────────
{
  const p = await page()
  await p.route('**/api/commandes', route => route.fulfill({ status: 500, body: JSON.stringify({ error: 'boom' }) }))
  await p.goto(`${BASE}/configurateur?produit=ensemble-3-pieces`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  await p.getByLabel(/Quantité en M$/).fill('2')
  await p.getByRole('button', { name: /Continuer/ }).first().click()
  await p.getByRole('button', { name: /Passer cette étape|Continuer/ }).first().click()
  await p.getByLabel(/Nom complet/).fill('Yacine Test')
  await p.getByLabel(/^Téléphone/).fill('0557440522')
  await p.getByLabel(/Wilaya/).selectOption({ label: /Alger/ }).catch(async () => {
    await p.selectOption('#wilaya', { index: 17 })
  })
  await p.getByRole('button', { name: /Confirmer la commande/ }).first().click()
  await p.waitForTimeout(900)
  const confirmee = await p.getByText(/Commande enregistrée/).count()
  const erreur = await p.getByText(/pas pu enregistrer/i).count()
  const saisieIntacte = (await p.getByLabel(/Nom complet/).inputValue()) === 'Yacine Test'
  if (confirmee === 0 && erreur > 0 && saisieIntacte) ok('5. Échec serveur → erreur affichée, aucune confirmation, saisie conservée')
  else ko('5. Échec serveur', `confirmation=${confirmee} erreur=${erreur} saisie=${saisieIntacte}`)
  await p.context().close()
}

// ── 6. Collection : plusieurs tailles, sous-total vs livraison ────
{
  const p = await page()
  await p.goto(`${BASE}/collection`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  await p.getByRole('button', { name: 'Commander' }).first().click()
  await p.getByLabel(/Quantité en taille M/).fill('0')  // la modale démarre à M = 1
  await p.getByLabel(/Quantité en taille S/).fill('2')
  await p.getByLabel(/Quantité en taille L/).fill('3')
  await p.waitForTimeout(250)
  const modale = await p.locator('[role="dialog"]').innerText()
  const sousTotal = /16\s?000|16 000/.test(modale)   // 5 × 3 200
  const livraison = /Livraison à confirmer/.test(modale)
  const pasDeFausseCommande = /n'est enregistré|n’est enregistré/i.test(modale)
  if (sousTotal && livraison && pasDeFausseCommande)
    ok('6. Collection → sous-total 16 000 DA, livraison à confirmer, aucune commande enregistrée')
  else ko('6. Collection', `sousTotal=${sousTotal} livraison=${livraison} mention=${pasDeFausseCommande}`)
  await p.context().close()
}

// ── 7. Revente : quantités par taille et devis ────────────────────
{
  const p = await page()
  await p.goto(`${BASE}/revente`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  await p.locator('article', { hasText: 'ENSEMBLE 3 PIÈCES' }).getByRole('button', { name: /Quantités par taille/ }).click()
  await p.getByLabel(/Quantité ENSEMBLE 3 PIÈCES en M/).fill('30')
  await p.waitForTimeout(250)
  const recap = await p.locator('table').first().innerText().catch(() => '')
  const corps = await p.locator('main').innerText()
  const ligneOk = /M × 30/.test(recap) || /M × 30/.test(corps)
  const livraison = /Livraison à confirmer/.test(corps)
  if (ligneOk && livraison) ok('7. Revente → série par taille récapitulée, livraison à confirmer')
  else ko('7. Revente', `ligne=${ligneOk} livraison=${livraison}`)
  await p.context().close()
}

// ── 8. Instagram unifié ───────────────────────────────────────────
{
  const p = await page()
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  const html = await p.content()
  if (html.includes('instagram.com/mycaractere') && !html.includes('instagram.com/caractere.store'))
    ok('8. Instagram unifié sur @mycaractere')
  else ko('8. Instagram', `mycaractere=${html.includes('mycaractere')} ancien=${html.includes('caractere.store')}`)
  await p.context().close()
}

// ── 9. Trois intentions visibles sur l’accueil ────────────────────
{
  const p = await page()
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  const texte = await p.locator('main').innerText()
  const trois = ['Personnaliser pour moi', 'Commander pour revendre', 'Habiller mon équipe'].filter(t => texte.includes(t))
  if (trois.length === 3) ok('9. Trois intentions visibles sur l’accueil')
  else ko('9. Trois intentions', `trouvées: ${trois.join(', ')}`)
  await p.context().close()
}

// ── 10. Cartes produit de l’accueil → configuration précise ───────
{
  const p = await page()
  await p.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  const liens = await p.locator('a[href^="/configurateur?produit="]').evaluateAll(as => as.map(a => a.getAttribute('href')))
  if (liens.length >= 6 && liens.every(h => h.includes('produit=')))
    ok('10. Cartes accueil → configuration précise', `${liens.length} cartes, ex. ${liens[0]}`)
  else ko('10. Cartes accueil', `liens=${JSON.stringify(liens)}`)
  await p.context().close()
}

// ── 11. Largeurs 375 / 390 / 768 / 1440 : pas de débordement ──────
for (const largeur of [375, 390, 768, 1440]) {
  const p = await page(largeur)
  for (const chemin of ['/', '/produits', '/collection', '/configurateur?produit=ensemble-3-pieces', '/revente']) {
    await p.goto(`${BASE}${chemin}`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
    const debordement = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    if (debordement > 1) ko(`11. ${largeur}px ${chemin}`, `débordement horizontal de ${debordement}px`)
    else ok(`11. ${largeur}px ${chemin}`, 'aucun débordement')
  }
  await p.context().close()
}

// ── 12. Mobile : l’action principale ne masque pas le formulaire ──
{
  const p = await page(375)
  await p.goto(`${BASE}/configurateur?produit=ensemble-3-pieces`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  await p.getByRole('button', { name: /Continuer/ }).first().click()
  await p.getByRole('button', { name: /Passer cette étape|Continuer/ }).first().click()
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await p.waitForTimeout(400)
  const masque = await p.evaluate(() => {
    const barre = document.querySelector('[class*="barreMobile"]')
    if (!barre) return 'barre absente'
    const b = barre.getBoundingClientRect()
    // Dernier champ du formulaire : doit rester atteignable sous la barre.
    const notes = document.querySelector('#notes')
    if (!notes) return 'champ notes absent'
    const n = notes.getBoundingClientRect()
    return n.bottom <= b.top ? 'ok' : `chevauchement de ${Math.round(n.bottom - b.top)}px`
  })
  if (masque === 'ok') ok('12. Mobile → barre d’action sans recouvrir le formulaire')
  else ko('12. Mobile barre d’action', masque)
  await p.context().close()
}

// ── 13. Bascule AR → RTL ──────────────────────────────────────────
{
  const p = await page(390)
  await p.goto(`${BASE}/configurateur?produit=ensemble-3-pieces`, { waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(PAUSE)
  await p.getByRole('button', { name: /بالعربية/ }).click()
  await p.waitForTimeout(400)
  const dir = await p.evaluate(() => document.documentElement.dir)
  const lang = await p.evaluate(() => document.documentElement.lang)
  const titre = await p.locator('h1').first().innerText()
  const debordement = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  if (dir === 'rtl' && lang === 'ar' && debordement <= 1 && /[؀-ۿ]/.test(titre))
    ok('13. Bascule AR → dir=rtl, lang=ar, texte arabe, pas de débordement', titre)
  else ko('13. Bascule AR', `dir=${dir} lang=${lang} débordement=${debordement} titre="${titre}"`)
  await p.context().close()
}

await browser.close()

console.log('\n══════════ RÉSULTATS ══════════')
for (const [statut, nom, detail] of resultats) console.log(`${statut} ${nom}${detail ? ' — ' + detail : ''}`)
const echecs = resultats.filter(r => r[0] === 'ECHEC')
console.log(`\n${resultats.length - echecs.length}/${resultats.length} vérifications passées`)
process.exit(echecs.length ? 1 : 0)
