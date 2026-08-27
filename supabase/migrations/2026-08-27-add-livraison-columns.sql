-- À exécuter une fois dans Supabase → SQL Editor → New query (projet du site,
-- celui utilisé par NEXT_PUBLIC_SUPABASE_URL dans .env.local).
--
-- Ajoute les colonnes de livraison à la table commandes, utilisées par le
-- nouveau checkout /back-to-school (et réutilisables par tout futur checkout
-- en ligne). Sans cette migration, les commandes du checkout échoueront.

alter table commandes
  add column if not exists mode_livraison text check (mode_livraison in ('domicile','bureau')),
  add column if not exists wilaya text,
  add column if not exists commune text,
  add column if not exists adresse text;
