# Caractère Store — Site complet + Admin

Site vitrine B2B + Interface admin + Dashboard commandes.
Stack : Next.js 14 · Tailwind CSS · TypeScript · Supabase · Resend
 
---

## 🚀 MISE EN LIGNE (étape par étape)

### ÉTAPE 1 — Supabase (base de données)

1. Aller sur **supabase.com** → ton projet
2. Cliquer sur **SQL Editor** → **New query**
3. Copier-coller tout le contenu de `supabase/schema.sql`
4. Cliquer **Run**
5. Aller dans **Settings → API** → noter :
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### ÉTAPE 2 — Resend (emails)

1. Aller sur **resend.com** → créer un compte
2. **API Keys** → **Create API Key**
3. Copier la clé → `RESEND_API_KEY`

### ÉTAPE 3 — GitHub (hébergement du code)

1. Aller sur **github.com** → **New repository**
2. Nom : `caractere-store` → **Create repository**
3. Sur la page du repo vide, cliquer **uploading an existing file**
4. Glisser tous les fichiers du zip
5. Cliquer **Commit changes**

### ÉTAPE 4 — Vercel (déploiement)

1. Aller sur **vercel.com** → **Add New Project**
2. Sélectionner ton repo GitHub `caractere-store`
3. Dans **Environment Variables**, ajouter :

```
NEXT_PUBLIC_SUPABASE_URL        = (depuis Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (depuis Supabase)
SUPABASE_SERVICE_ROLE_KEY       = (depuis Supabase)
RESEND_API_KEY                  = (depuis Resend)
ADMIN_EMAIL                     = ton@email.com
ADMIN_PASSWORD                  = MotDePasseSecret123
NEXTAUTH_SECRET                 = uneChaineTresLongueEtAleatoire
```

4. Cliquer **Deploy** → attendre 2 minutes
5. Ton site est en ligne ! 🎉

---

## 📱 Accès admin

- **Site public** : `https://ton-site.vercel.app`
- **Admin** : `https://ton-site.vercel.app/admin`
- **Mot de passe** : celui que tu as mis dans `ADMIN_PASSWORD`

---

## 🎛️ Interface admin

| Page | URL | Description |
|---|---|---|
| Dashboard | `/admin` | Stats + dernières commandes |
| Commandes | `/admin/commandes` | Liste, détails, changer statut, contacter WhatsApp |
| Produits | `/admin/produits` | Ajouter/modifier/supprimer/activer |
| Couleurs | `/admin/couleurs` | Ajouter/modifier/supprimer |
| Tailles | `/admin/tailles` | Ajouter/supprimer/activer |

---

## 📧 Notifications

À chaque commande reçue → email automatique à `ADMIN_EMAIL` avec :
- Tous les détails de la commande
- Lien direct vers l'admin
- Lien pour contacter le client sur WhatsApp

---

## ✏️ Personnaliser

- **Numéro WhatsApp** : chercher `213XXXXXXXXX` dans le code, remplacer
- **Contenu du site** : modifiable depuis `supabase.com → Table Editor → site_config`
- **Produits** : depuis `/admin/produits`
- **Couleurs** : depuis `/admin/couleurs`
- **Tailles** : depuis `/admin/tailles`
