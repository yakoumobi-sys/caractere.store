// Résolution du catalogue, tarification et coloris.
// Ces tests couvrent les scénarios de recette « Ensemble 3 pièces »,
// « produit inconnu » et « prix modifié côté client ».

import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CATALOGUE,
  resoudreProduit,
  lienConfigurateur,
  calculerTarif,
  remisePourQuantite,
  dedupliquerCouleurs,
  couleursPourProduit,
  estTailleVestimentaire,
  normaliser,
} from '../lib/catalogue'

test('chaque identifiant du catalogue est unique', () => {
  const ids = CATALOGUE.map(p => p.id)
  assert.equal(new Set(ids).size, ids.length)
})

test('l’ensemble 3 pièces se résout par identifiant, avec son prix', () => {
  const produit = resoudreProduit('ensemble-3-pieces')
  assert.ok(produit, 'le produit doit être trouvé')
  assert.equal(produit.nom, 'ENSEMBLE 3 PIÈCES')
  assert.equal(produit.prix, 5000)
})

test('les anciens liens par nom continuent de résoudre', () => {
  // C'est exactement le lien que /produits générait avant la correction :
  // « /configurateur?produit=ENSEMBLE 3 PIÈCES ».
  for (const ancien of ['ENSEMBLE 3 PIÈCES', 'ensemble 3 pieces', 'Ensemble 3 Pieces']) {
    const produit = resoudreProduit(ancien)
    assert.ok(produit, `« ${ancien} » doit résoudre`)
    assert.equal(produit.id, 'ensemble-3-pieces')
  }
})

test('les alias du configurateur historique résolvent vers la bonne fiche', () => {
  assert.equal(resoudreProduit('T-shirt')?.id, 'tshirt-personnalise')
  assert.equal(resoudreProduit('Polo')?.id, 'polo-personnalise')
  assert.equal(resoudreProduit('Gilet de securite')?.id, 'gilet-securite')
})

test('un produit inconnu renvoie null — jamais un produit par défaut', () => {
  for (const inconnu of ['', '   ', 'produit-qui-nexiste-pas', '../../etc/passwd', null, undefined]) {
    assert.equal(resoudreProduit(inconnu), null, `« ${inconnu} » ne doit rien renvoyer`)
  }
})

test('le lien configurateur transporte l’identifiant stable', () => {
  const produit = resoudreProduit('ENSEMBLE 3 PIÈCES')!
  assert.equal(lienConfigurateur(produit), '/configurateur?produit=ensemble-3-pieces')
})

test('le tarif applique les paliers de remise', () => {
  const produit = { prix: 1000 }
  assert.deepEqual(calculerTarif(produit, 10), { chiffre: true, unitaire: 1000, total: 10_000, remise: 0 })
  assert.deepEqual(calculerTarif(produit, 50), { chiffre: true, unitaire: 950, total: 47_500, remise: 0.05 })
  assert.deepEqual(calculerTarif(produit, 100), { chiffre: true, unitaire: 900, total: 90_000, remise: 0.1 })
  assert.equal(remisePourQuantite(49), 0)
  assert.equal(remisePourQuantite(99), 0.05)
  assert.equal(remisePourQuantite(1000), 0.1)
})

test('une pièce sans tarif publié n’est jamais chiffrée à zéro', () => {
  // Sans prix de référence, la commande est « sur devis » : elle ne doit pas
  // être enregistrée comme si elle était gratuite.
  const tarif = calculerTarif({ prix: undefined }, 20)
  assert.equal(tarif.chiffre, false)
  assert.equal(tarif.total, 0)
  assert.equal(calculerTarif(null, 5).chiffre, false)
})

test('les quantités aberrantes ne produisent pas de total absurde', () => {
  const produit = { prix: 1000 }
  assert.equal(calculerTarif(produit, -5).total, 0)
  assert.equal(calculerTarif(produit, NaN).total, 0)
  assert.equal(calculerTarif(produit, 2.7).total, 2000, 'la quantité est arrondie à l’entier inférieur')
})

test('les doublons de couleurs disparaissent, les nuances distinctes restent', () => {
  const uniques = dedupliquerCouleurs([
    { nom: 'Noir', hex: '#1A1A1A' },
    { nom: 'noir', hex: '#1a1a1a' }, // même teinte, casse différente → doublon
    { nom: 'Black', hex: '#1A1A1A' }, // même teinte, autre nom → doublon
    { nom: 'Gris', hex: '#888888' },
    { nom: 'Gris', hex: '#555555' }, // même nom, teinte différente → à garder
  ])
  assert.equal(uniques.length, 3)
  assert.deepEqual(uniques.map(c => c.hex), ['#1A1A1A', '#888888', '#555555'])
})

test('seuls les coloris dans lesquels la pièce existe sont proposés', () => {
  // Un ensemble imprimé sur fond gris ne doit pas laisser choisir « Rouge ».
  const dragon = resoudreProduit('ensemble-dragon')!
  const coloris = couleursPourProduit(dragon)
  assert.deepEqual(coloris.map(c => c.nom), ['Gris'])

  // Un support personnalisable garde toute la palette.
  const tshirt = resoudreProduit('tshirt-personnalise')!
  assert.ok(couleursPourProduit(tshirt).length > 1)
})

test('« Unique » et « Sur mesure » ne sont pas des tailles de vêtement', () => {
  assert.equal(estTailleVestimentaire('M'), true)
  assert.equal(estTailleVestimentaire('XXL'), true)
  assert.equal(estTailleVestimentaire('Unique'), false)
  assert.equal(estTailleVestimentaire('Sur mesure'), false)
})

test('la normalisation rend les accents et la ponctuation indifférents', () => {
  assert.equal(normaliser('ENSEMBLE 3 PIÈCES'), 'ensemble-3-pieces')
  assert.equal(normaliser('  Koï  '), 'koi')
  assert.equal(normaliser('VESTE + BAGGY ELASTIQUE'), 'veste-baggy-elastique')
})

test('toute pièce du catalogue est configurable de bout en bout', () => {
  // Garde-fou : une fiche mal remplie (sans taille, ou avec un coloris qui ne
  // correspond à rien) bloquerait le configurateur en silence.
  for (const produit of CATALOGUE) {
    assert.ok(produit.tailles.length > 0, `${produit.id} doit avoir au moins une taille`)
    assert.ok(couleursPourProduit(produit).length > 0, `${produit.id} doit avoir au moins un coloris`)
    assert.equal(resoudreProduit(produit.id)?.id, produit.id)
  }
})
