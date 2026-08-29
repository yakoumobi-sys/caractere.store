# 🔐 Checklist de Sécurité Post-Audit

## Phase 1: Actions Urgentes (À faire IMMÉDIATEMENT) ⏰

### 1. Régénération des Secrets
```bash
# ⚠️ CRITIQUE - Faire maintenant!
```

**Supabase:**
1. Allez sur https://app.supabase.com/project/aiJlvbIpVqnvbywxHlbd
2. Allez dans Project Settings → API Keys
3. Cliquez "Rotate keys" pour:
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Copiez les nouvelles clés
5. Mettez à jour sur Vercel Environment Variables

**Upstash Redis:**
1. Allez sur https://console.upstash.io
2. Trouvez la base "dominant-griffon"
3. Régénérez le token REST
4. Mettez à jour:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Admin Password:**
- Remplacez `motdepassesecret123` par un mot de passe sécurisé
- Stockez-le dans Vercel Secrets (pas en code!)

### 2. Vérifier les Logs d'Accès
```bash
# Vérifier qui a accédé à Supabase avec les anciennes clés
```

**Supabase Logs:**
1. Project → Logs
2. Chercher les logs suspectes après 2026-08-27
3. Si logs anormales → contacter support Supabase

### 3. Tester les Fixes
```bash
# Après le merge de la PR
npm install
npm run build
npm run dev

# Tester les endpoints:
# POST /api/contact - avec XSS payload
# POST /api/admin/marketing/email - avec HTML malveillant
# POST /api/auth/register - validation mot de passe
```

---

## Phase 2: Actions Post-Merge (Cette semaine)

### 1. Déployer en Production
```bash
# Mergez la PR quand vous êtes prêt
# Vercel auto-déploiera
# Vérifiez que les builds passent
```

### 2. Vérifier les Headers de Sécurité
```bash
# Utilisez une tool en ligne:
# https://securityheaders.com
# https://observatory.mozilla.org

# Ou via curl:
curl -I https://caracterestore.dz
# Cherchez:
# - X-Frame-Options: SAMEORIGIN
# - Strict-Transport-Security
# - Content-Security-Policy
```

### 3. Test de Charge (Rate Limiting)
```bash
# Testez le rate limiting avec ab (Apache Bench)
# Simule 100 requêtes à /api/contact
ab -n 100 -c 10 https://caracterestore.dz/api/contact

# Doit retourner 429 (Too Many Requests) après 5 requêtes
```

### 4. Scanning de Sécurité
```bash
# OWASP ZAP (gratuit)
# https://www.zaproxy.org/

# OU Burp Suite Community
# https://portswigger.net/burp/communitydownload

# OU BuiltWith Security
# https://builtwith.com/
```

---

## Phase 3: Maintenance Continue (Mensuel)

### 1. Audit des Dépendances
```bash
npm audit
# Corriger les vulnérabilités haute/critique
npm audit fix
npm audit fix --force (seulement si nécessaire)
```

### 2. Update des Packages
```bash
npm outdated
npm update
# Tester après chaque update importante
```

### 3. Rotation des Secrets
- Tous les 90 jours: Régénérer les clés
- Tous les 6 mois: Rotation des certificats SSL

### 4. Log Review
```bash
# Vérifier une fois par semaine:
# - Logs d'erreurs
# - Tentatives de 429 (rate limit)
# - Accès aux /api/admin (non-autorisés)
```

---

## Phase 4: Améliorations Futures (Trimestrial)

### 1. Mettre à Place un WAF
- Utiliser Cloudflare WAF Rules
- OU AWS Shield
- OU Vercel Shield

### 2. Ajouter du Monitoring
```bash
# Option 1: Sentry (ErrorTracking)
npm install @sentry/nextjs

# Option 2: LogRocket
npm install logrocket

# Option 3: DataDog
# https://www.datadoghq.com/
```

### 3. Implémenter CSRF Tokens
```bash
# Pour les formulaires HTML (non-API)
npm install csrf

# Voir: https://owasp.org/www-community/attacks/csrf
```

### 4. SQL Injection Prevention
- Vérifier que Supabase RLS (Row-Level Security) est activée
- Audit des queries directes à la DB

### 5. Compliance (RGPD, CCPA)
- [ ] Privacy Policy à jour
- [ ] RGPD: Droit à l'oubli implémenté
- [ ] Consentement cookies

---

## Commandes Utiles

### Vérifier HTTPS
```bash
curl -I https://caracterestore.dz
# Doit voir "200 OK"
```

### Tester CSP
```bash
# Allez sur https://csp-evaluator.withgoogle.com
# Collez votre URL
# Vérifiez les avertissements
```

### Vérifier que .env.local n'est pas versionné
```bash
git ls-tree -r HEAD .env.local
# Doit retourner RIEN (fichier pas dans git)

git log --follow .env.local
# Doit retourner RIEN
```

### Vérifier les Dépendances Vulnérables
```bash
npm audit --json > audit.json
# Exporte en JSON pour traitement
```

---

## Escalade en Cas de Problème

| Problème | Action |
|----------|--------|
| Les emails ne partent plus | Vérifier RESEND_API_KEY dans Vercel |
| Rate limiting trop strict | Augmenter les limites dans `/lib/rate-limit.ts` |
| Build échoue | Vérifier les logs Vercel |
| Sécurité headers pas visibles | Vérifier que Vercel a redeployé |
| Clés compromises | Régénérer IMMÉDIATEMENT + audit logs |

---

## Contact & Support

**Email**: yakoumobi@gmail.com
**GitHub**: https://github.com/yakoumobi-sys/caractere.store
**Security Report**: Ouvrir une issue privée

---

## Signatures

- **Audit réalisé par**: Claude Code Security Team
- **Date**: 2026-08-28
- **Prochaine révision**: 2026-12-28

```
✅ Toutes les failles critiques ont été corrigées
⚠️  Veuillez effectuer les actions post-audit
🔐 La sécurité est un processus continu
```
