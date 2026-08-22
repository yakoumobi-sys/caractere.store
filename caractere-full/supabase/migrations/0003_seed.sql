-- ============================================================================
-- Seed — Données initiales
-- ============================================================================

-- ============================================================================
-- ENTREPRISE
-- ============================================================================

insert into companies (name, email, phone, address)
values ('Caractère Store', 'contact@caractere.dz', '+213 555 123456', 'Alger, Algérie')
on conflict do nothing;

-- ============================================================================
-- EMPLOYÉS (11 employés de base avec couleurs assignées)
-- ============================================================================

insert into employees (first_name, last_name, email, department, role, color)
values
  ('Lilia', 'Commercial', 'lilia@caractere.dz', 'Commercial', 'Réception WhatsApp', '#EF4444'), -- Rouge
  ('Lydia', 'Commercial', 'lydia@caractere.dz', 'Commercial', 'Réception WhatsApp', '#F97316'), -- Orange
  ('Kholoud', 'Abderrahmane', 'kholoud@caractere.dz', 'Commercial', 'Commercial', '#EABB08'), -- Ambre
  ('Abderahmane', 'Commercial', 'abderahmane@caractere.dz', 'Commercial', 'Commercial', '#84CC16'), -- Citron
  ('Hafid', 'Commercial', 'hafid@caractere.dz', 'Commercial', 'Commercial', '#22C55E'), -- Vert
  ('Imène', 'DTF', 'imene@caractere.dz', 'Atelier DTF', 'Imprimante DTF', '#10B981'), -- Émeraude
  ('Nesro', 'DTF', 'nesro@caractere.dz', 'Atelier DTF', 'Imprimante DTF', '#14B8A6'), -- Sarcelle
  ('Manel', 'Broderie', 'manel@caractere.dz', 'Atelier Broderie', 'Brodeuse', '#06B6D4'), -- Cyan
  ('Ikram', 'Flocage', 'ikram@caractere.dz', 'Atelier Flocage', 'Flocage', '#0EA5E9'), -- Ciel
  ('Hanane', 'Flocage', 'hanane@caractere.dz', 'Atelier Flocage', 'Flocage', '#3B82F6'), -- Bleu
  ('Aymene', 'Flocage', 'aymene@caractere.dz', 'Atelier Flocage', 'Flocage', '#EC4899') -- Rose
on conflict (email) do nothing;

-- ============================================================================
-- CATEGORIES DE PRODUITS
-- ============================================================================

insert into product_categories (name, description)
values
  ('Vêtements', 'Collection de vêtements personnalisés'),
  ('Accessoires', 'Accessoires de marque'),
  ('Équipement', 'Équipement de travail')
on conflict (name) do nothing;

-- ============================================================================
-- PRODUITS (Catalogue 2025)
-- ============================================================================

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'T-shirt Élixir',
  'T-shirt premium personnalisable',
  'TSHIRT-ELIXIR',
  (select id from product_categories where name = 'Vêtements'),
  1950,
  950
where not exists (select 1 from products where sku = 'TSHIRT-ELIXIR');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Polo Djebs',
  'Polo djebs personnalisable',
  'POLO-DJEBS',
  (select id from product_categories where name = 'Vêtements'),
  2500,
  1200
where not exists (select 1 from products where sku = 'POLO-DJEBS');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Baggy',
  'Pantalon baggy personnalisable',
  'BAGGY',
  (select id from product_categories where name = 'Vêtements'),
  1300,
  1300
where not exists (select 1 from products where sku = 'BAGGY');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Short',
  'Short personnalisable',
  'SHORT',
  (select id from product_categories where name = 'Vêtements'),
  1100,
  1100
where not exists (select 1 from products where sku = 'SHORT');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Sweat',
  'Sweat personnalisable',
  'SWEAT',
  (select id from product_categories where name = 'Vêtements'),
  1300,
  1300
where not exists (select 1 from products where sku = 'SWEAT');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Sweat Elmo',
  'Sweat elmo personnalisable',
  'SWEAT-ELMO',
  (select id from product_categories where name = 'Vêtements'),
  1800,
  1800
where not exists (select 1 from products where sku = 'SWEAT-ELMO');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Jogg Slim',
  'Jogging slim personnalisable',
  'JOGG-SLIM',
  (select id from product_categories where name = 'Vêtements'),
  1250,
  1250
where not exists (select 1 from products where sku = 'JOGG-SLIM');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Gilet Col Rond',
  'Gilet col rond personnalisable',
  'GILET-COL-ROND',
  (select id from product_categories where name = 'Vêtements'),
  2750,
  1750
where not exists (select 1 from products where sku = 'GILET-COL-ROND');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Gilet Sécurité',
  'Gilet de sécurité personnalisable',
  'GILET-SECURITE',
  (select id from product_categories where name = 'Accessoires'),
  1500,
  750
where not exists (select 1 from products where sku = 'GILET-SECURITE');

insert into products (name, description, sku, category_id, sale_price, purchase_cost)
select
  'Tote Bag',
  'Sac tote personnalisable',
  'TOTE-BAG',
  (select id from product_categories where name = 'Accessoires'),
  950,
  350
where not exists (select 1 from products where sku = 'TOTE-BAG');

-- ============================================================================
-- ENTREPÔT DÉFAUT
-- ============================================================================

insert into warehouses (name, location)
values ('Principal', 'Alger')
on conflict do nothing;

-- ============================================================================
-- PLAN COMPTABLE (Algérie - Simplifié)
-- ============================================================================

insert into chart_of_accounts (code, name, account_type)
values
  ('101000', 'Capital Social', 'equity'),
  ('411000', 'Clients', 'asset'),
  ('401000', 'Fournisseurs', 'liability'),
  ('701000', 'Ventes de marchandises', 'revenue'),
  ('701001', 'Ventes de services', 'revenue'),
  ('601000', 'Achats de marchandises', 'expense'),
  ('611000', 'Rémunérations', 'expense'),
  ('621000', 'Loyer', 'expense'),
  ('631000', 'Électricité/Eau', 'expense')
on conflict (code) do nothing;
