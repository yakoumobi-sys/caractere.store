-- ================================================
-- SCHÉMA SUPABASE — Caractère Store
-- Coller dans : Supabase > SQL Editor > New query
-- ================================================

-- Produits
create table if not exists produits (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  emoji text default '👕',
  description text,
  prix_base integer not null default 0,
  actif boolean default true,
  ordre integer default 0,
  created_at timestamptz default now()
);

-- Couleurs
create table if not exists couleurs (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  hex text not null default '#ffffff',
  actif boolean default true,
  ordre integer default 0
);

-- Tailles
create table if not exists tailles (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  actif boolean default true,
  ordre integer default 0
);

-- Commandes
create table if not exists commandes (
  id uuid default gen_random_uuid() primary key,
  reference text unique not null,
  statut text default 'nouveau' check (statut in ('nouveau','en_cours','termine','annule')),
  produit text not null,
  quantite integer not null,
  couleur text not null,
  tailles text[] default '{}',
  position text,
  technique text,
  urgent boolean default false,
  logo_url text,
  nom_client text not null,
  entreprise text,
  telephone text not null,
  email text,
  notes text,
  prix_unitaire integer default 0,
  prix_total integer default 0,
  created_at timestamptz default now()
);

-- Contenu du site (textes modifiables)
create table if not exists site_config (
  id uuid default gen_random_uuid() primary key,
  cle text unique not null,
  valeur text not null,
  updated_at timestamptz default now()
);

-- ── Données par défaut ──

insert into produits (nom, emoji, description, prix_base, ordre) values
  ('T-shirt',      '👕', '100% coton, broderie ou DTF',   850,  1),
  ('Polo MC',      '👔', 'Piqué coton premium',           1400, 2),
  ('Polo ML',      '👔', 'Manches longues',               1600, 3),
  ('Sweat',        '🧥', 'Coton fleece 280g',             2200, 4),
  ('Sweat Capuche','🧥', 'Premium hoodie',                2600, 5),
  ('Casquette',    '🧢', 'Broderie structurée',           900,  6)
on conflict do nothing;

insert into couleurs (nom, hex, ordre) values
  ('Blanc',         '#FFFFFF', 1),
  ('Noir',          '#1d1d1f', 2),
  ('Marine',        '#1B2A4A', 3),
  ('Gris',          '#9E9E9E', 4),
  ('Bordeaux',      '#6D1A2A', 5),
  ('Vert bouteille','#1B4D3E', 6),
  ('Beige',         '#D4B896', 7),
  ('Bleu ciel',     '#87CEEB', 8),
  ('Rouge',         '#C0392B', 9),
  ('Kaki',          '#7D7035', 10)
on conflict do nothing;

insert into tailles (nom, ordre) values
  ('XS',   1), ('S',    2), ('M',   3),
  ('L',    4), ('XL',   5), ('XXL', 6), ('XXXL', 7)
on conflict do nothing;

insert into site_config (cle, valeur) values
  ('hero_titre',       'Habillez votre équipe. Faites-le bien.'),
  ('hero_sous_titre',  'Broderie, DTF, uniformes — de 10 à 10 000 pièces. Devis gratuit sous 24h.'),
  ('whatsapp_numero',  '213XXXXXXXXX'),
  ('adresse',          'Alger, Algérie'),
  ('instagram',        '@caractere.store'),
  ('delai_reponse',    'Sous 24 heures')
on conflict do nothing;

-- ── RLS (Row Level Security) ──
alter table produits enable row level security;
alter table couleurs enable row level security;
alter table tailles enable row level security;
alter table commandes enable row level security;
alter table site_config enable row level security;

-- Lecture publique pour produits, couleurs, tailles, config
create policy "lecture publique produits"    on produits    for select using (true);
create policy "lecture publique couleurs"    on couleurs    for select using (true);
create policy "lecture publique tailles"     on tailles     for select using (true);
create policy "lecture publique site_config" on site_config for select using (true);

-- Insertion commandes publique (pour que les clients puissent commander)
create policy "insertion commandes"          on commandes   for insert with check (true);

-- Tout le reste nécessite le service role (API admin uniquement)
