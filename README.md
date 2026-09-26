# Caractère Store

Site Next.js de personnalisation textile : entreprises, créateurs et commandes à la pièce.

## Développement

```sh
npm ci
npm run dev
npm run build
node --test tests/contact-route.test.cjs
```

Copier `.env.local.example` vers `.env.local`, puis renseigner les variables du projet. Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` dans une variable `NEXT_PUBLIC_`.

## Demandes de devis

- `/devis-express` : formulaire français/arabe avec pièce jointe facultative (formats vérifiés côté serveur, 4 Mo maximum), validation et confirmation après enregistrement.
- `/api/contact` : valide et enregistre la demande dans `public.contact_requests` avant toute notification. Les retries portant le même `request_id` ne créent pas de doublons.
- `/admin/devis` : boîte de réception avec pagination et statuts Nouveau / Contacté / Terminé.
- `/api/admin/devis` : authentification et autorisation admin obligatoires via le mécanisme existant `requireAdmin`.
- Migration : `supabase/migrations/20260926005623_contact_requests.sql`. Appliquée au projet Caractere.store lors de la refonte. RLS activé, aucun accès pour les rôles navigateur.

Les notifications Resend sont facultatives : leur échec ne perd pas une demande sauvegardée. Les variables Upstash activent une limitation distribuée ; sans elles, la limitation est locale à chaque instance et ne constitue pas un quota global.

## Validation de la refonte

Les tests automatisés couvrent l'enregistrement, les doublons, les pannes de base et d'e-mail, les paramètres manquants, les entrées invalides, les liens de fichiers externes et la limitation locale. Aucun e-mail réel n'est envoyé par les tests.

La refonte conserve les parcours de commande, le catalogue, la collection, le designer et l'authentification existants. Elle ne modifie ni les commandes existantes ni les tarifs.

Next.js a été corrigé de 14.2.5 à 14.2.35 sans migration majeure. La branche 14 étant ancienne, une migration vers une branche actuellement maintenue reste nécessaire pour une mise à niveau de sécurité complète ; elle devra aussi valider la compatibilité React du studio 3D. Cette refonte n'est pas un audit exhaustif du code historique.
