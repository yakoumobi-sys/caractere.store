-- À exécuter une fois dans Supabase → SQL Editor → New query (projet du site,
-- celui utilisé par NEXT_PUBLIC_SUPABASE_URL dans .env.local).
--
-- Fiabilisation des commandes :
--
-- 1. `quantites_tailles` — la répartition par taille (ex. {"S":3,"M":5}).
--    La colonne `tailles` ne portait que la liste des tailles choisies, sans
--    dire combien de pièces dans chacune : l'atelier devait rappeler le client
--    pour produire. Elle reste renseignée pour l'admin existant.
--
-- 2. `produit_id` — l'identifiant catalogue stable de la pièce commandée.
--    `produit` ne contenait qu'un libellé, impossible à raccrocher au
--    catalogue une fois un nom modifié.
--
-- 3. `canal` — d'où vient la commande (configurateur, entreprises, revente).
--
-- 4. `empreinte` — empreinte anti-doublon d'une commande (client + pièce +
--    quantité) sur une courte fenêtre. L'index unique partiel empêche un
--    double clic ou un renvoi réseau de créer deux commandes identiques.

alter table commandes
  add column if not exists quantites_tailles jsonb default '{}'::jsonb,
  add column if not exists produit_id text,
  add column if not exists canal text,
  add column if not exists empreinte text;

create unique index if not exists commandes_empreinte_unique
  on commandes (empreinte)
  where empreinte is not null;

-- La lecture publique d'une commande passe désormais par l'API, qui ne
-- renvoie les données personnelles qu'à l'admin ou au client qui prouve
-- connaître son numéro de téléphone. On s'assure donc qu'aucune policy
-- n'autorise la lecture anonyme de la table.
alter table commandes enable row level security;
