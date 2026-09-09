# Fuite de secrets — .env.local exposé publiquement

## Ce qui s'est passé

Le fichier `.env.local` était **suivi par Git** dans un dépôt **public**
(`github.com/yakoumobi-sys/caractere.store`). `.gitignore` contient bien
`.env*.local`, mais cette règle n'a aucun effet sur un fichier déjà ajouté à
l'index : le fichier a donc continué d'être publié à chaque commit.

Secrets concernés :

| Variable | Portée |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | **Critique** — contourne toutes les règles RLS : lecture/écriture/suppression sur toute la base, gestion des comptes auth |
| `UPSTASH_REDIS_REST_TOKEN` | Accès complet à l'instance Redis (rate limiting) |
| `ADMIN_PASSWORD` | Mot de passe admin en clair |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publique par nature — pas un problème |

Ces valeurs restent lisibles dans **l'historique Git**, même après ce commit.
Les retirer du suivi ne suffit pas : **il faut les régénérer**.

## Remédiation

- [x] `.env.local` retiré du suivi Git (ce commit)
- [ ] Dépôt GitHub passé en privé
- [ ] `SUPABASE_SERVICE_ROLE_KEY` régénérée (Supabase → Settings → API)
- [ ] `UPSTASH_REDIS_REST_TOKEN` régénéré (Upstash → Details → Rotate)
- [ ] `ADMIN_PASSWORD` changé
- [ ] Nouvelles valeurs saisies dans Vercel (Settings → Environment Variables)
- [ ] Redéploiement vérifié

> **Ordre important** : renseigner les variables dans Vercel **avant** de
> fusionner ce commit dans `main`. Si la production s'appuyait sur le
> `.env.local` du dépôt, le retirer sans configurer Vercel casserait le site.

## Configuration Supabase à corriger au passage

`Site URL` pointe encore vers `https://mycaractere.xyz` et la liste
`Redirect URLs` est vide. Conséquence : tous les emails de réinitialisation de
mot de passe renvoient vers l'ancien domaine — c'est ce qui a rendu la
récupération de compte impossible.

À régler dans Supabase → Authentication → URL Configuration :

- Site URL : `https://www.caracteredz.com`
- Redirect URLs : `https://www.caracteredz.com/**` et `https://caracteredz.com/**`
