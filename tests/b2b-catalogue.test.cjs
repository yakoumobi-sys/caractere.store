const { test } = require('node:test')
const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
const vm = require('node:vm')
const source = ts.transpileModule(fs.readFileSync('lib/b2b-catalogue.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const scope = { exports: {} }
vm.runInNewContext(source, scope)
const { B2B_PRODUITS, findB2BProduit, getB2BPrice, getB2BTiers, applyB2BPricing } = scope.exports

// Expected prices transcribed from the supplied Caractère price sheet.
const expected = [
 ['T-shirt Premium', 2100, 1950, 1750],
 ['T-shirt Medium', 1950, 1750, 1550],
 ['Polo personnalisé', 2350, 2050, 1950],
 ['Gilet Premium', 2750, 2550, 2350],
 ['Gilet Medium', 2500, 2350, 2150],
 ['Casquette personnalisée', 1500, 1150, 950],
 ['Tote bag personnalisé', 950, 750, 600],
]
test('exactly the ten requested products with existing local illustrations', () => {
 assert.equal(B2B_PRODUITS.length, 10)
 assert.equal(new Set(B2B_PRODUITS.map(p => p.id)).size, 10)
 for (const p of B2B_PRODUITS) assert.ok(fs.existsSync('public' + p.image))
})
for (const [name, first, second, third] of expected) test(name + ': tier boundaries and total', () => {
 const p = findB2BProduit(name)
 for (const [q, price] of [[1,first],[19,first],[20,second],[49,second],[50,third],[99,third],[100,third]]) {
  const result = getB2BPrice(p, q)
  assert.equal(result.unit, price)
  assert.equal(result.total, price*q)
  assert.equal(result.remise, 0, 'No additional percentage discount')
  assert.equal(getB2BTiers(p,q).filter(t=>t.active).length, 1)
 }
})
test('Events requires 50 pieces, fixed prices remain fixed', () => {
 const events=findB2BProduit('T-shirt Events')
 for(const q of [0,1,19,20,49,50.5,NaN,Infinity,100001]) assert.throws(()=>getB2BPrice(events,q))
 for(const [name,price,min] of [['T-shirt Events',750,50],['Gilet jaune personnalisé',750,1],['Tablier personnalisé',1200,1]]) {
  for(const q of [min,50,100,1000]) assert.equal(getB2BPrice(findB2BProduit(name),q).unit,price)
 }
})
test('server overwrites client prices, strips catalogue marker and rejects invalid B2B requests', () => {
 const order=applyB2BPricing({catalogue:'entreprises-2026-10',produit:'T-shirt Premium',quantite:50,prix_unitaire:1,prix_total:1,reference:'TEST'})
 assert.equal(order.prix_unitaire,1750)
 assert.equal(order.prix_total,87500)
 assert.equal(order.reference,'TEST')
 assert.equal('catalogue' in order,false)
 assert.throws(()=>applyB2BPricing({catalogue:'entreprises-2026-10',produit:'T-shirt Events',quantite:49}))
 assert.throws(()=>applyB2BPricing({catalogue:'entreprises-2026-10',produit:'Unknown',quantite:50}))
 const regular=applyB2BPricing({produit:'T-shirt',quantite:2,prix_unitaire:1950,prix_total:3900})
 assert.equal(regular.prix_total,3900)
})
