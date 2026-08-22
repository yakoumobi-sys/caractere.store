-- ============================================================================
-- SCHÉMA COMPLET SUPABASE — ERP Caractère
-- ============================================================================

-- ============================================================================
-- TABLES DE BASE
-- ============================================================================

-- Entreprises
create table if not exists companies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text,
  phone text,
  email text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Employés
create table if not exists employees (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  department text,
  role text,
  color text default '#7c3aed',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contacts (clients, fournisseurs)
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  contact_type text default 'client', -- 'client', 'supplier', 'prospect'
  address text,
  city text,
  postal_code text,
  company_id uuid references companies(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- PRODUCTION : Commandes et Articles
-- ============================================================================

-- Commandes en production
create table if not exists pipeline_orders (
  id uuid default gen_random_uuid() primary key,
  number text unique not null,
  contact_id uuid references contacts(id),
  contact_name text not null,
  technique text default 'aucune',
  status text default 'attente_dtf',
  assigned_to uuid references employees(id),
  amount_paid numeric(12,2) default 0,
  delivery_confirmed_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Articles dans une commande
create table if not exists pipeline_order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references pipeline_orders(id) on delete cascade,
  product_name text not null,
  color text,
  size text,
  quantity integer default 1,
  created_at timestamptz default now()
);

-- Impressions/Personnalisations dans une commande
create table if not exists pipeline_order_prints (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references pipeline_orders(id) on delete delete cascade,
  placement text,
  size_cm text,
  text_content text,
  created_at timestamptz default now()
);

-- ============================================================================
-- COLLABORATION
-- ============================================================================

-- Commentaires sur commandes
create table if not exists pipeline_comments (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references pipeline_orders(id) on delete cascade,
  author_id uuid references employees(id),
  content text not null,
  created_at timestamptz default now()
);

-- Tâches de production
create table if not exists production_tasks (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references pipeline_orders(id) on delete cascade,
  title text not null,
  status text default 'todo', -- 'todo', 'in_progress', 'done'
  assigned_to uuid references employees(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Réclamations/Problèmes
create table if not exists claims (
  id uuid default gen_random_uuid() primary key,
  number text unique not null,
  order_id uuid references pipeline_orders(id),
  contact_id uuid references contacts(id),
  issue_type text,
  priority text default 'normal',
  status text default 'open',
  resolution text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- PRODUITS ET INVENTAIRE
-- ============================================================================

-- Catégories de produits
create table if not exists product_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  created_at timestamptz default now()
);

-- Produits
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  sku text unique,
  category_id uuid references product_categories(id),
  unit_price numeric(12,2),
  sale_price numeric(12,2),
  purchase_cost numeric(12,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Niveaux de stock
create table if not exists product_stock_levels (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  warehouse_id uuid,
  size text,
  color text,
  quantity integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Entrepôts
create table if not exists warehouses (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text,
  created_at timestamptz default now()
);

-- ============================================================================
-- COMPTABILITÉ
-- ============================================================================

-- Plan comptable
create table if not exists chart_of_accounts (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  name text not null,
  account_type text,
  created_at timestamptz default now()
);

-- Écritures comptables
create table if not exists journal_entries (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references pipeline_orders(id),
  account_code text,
  description text,
  amount numeric(12,2),
  entry_type text, -- 'debit' or 'credit'
  created_at timestamptz default now()
);

-- ============================================================================
-- VUES ET MODÈLES
-- ============================================================================

-- Vue pour les commandes avec infos assignée
create or replace view pipeline_orders_view as
  select
    po.*,
    c.name as client_name,
    e.first_name as assignee_first_name,
    e.color as assignee_color
  from pipeline_orders po
  left join contacts c on po.contact_id = c.id
  left join employees e on po.assigned_to = e.id;

-- Vue des statistiques de production
create or replace view production_stats as
  select
    date_trunc('day', po.created_at)::date as day,
    po.technique,
    count(*) as order_count,
    sum(case when po.status = 'payee' then 1 else 0 end) as completed_count,
    avg(extract(epoch from (po.updated_at - po.created_at))/3600) as avg_hours
  from pipeline_orders po
  group by day, technique;

-- Vue des KPIs quotidiens
create or replace view daily_kpi as
  select
    date_trunc('day', po.created_at)::date as day,
    sum(po.amount_paid) as revenue,
    count(distinct po.id) as invoice_count,
    count(po.id) as order_count
  from pipeline_orders po
  group by day;

-- Vue des performances employé
create or replace view employee_performance as
  select
    e.id,
    e.first_name,
    count(pc.id) as total_actions,
    count(distinct po.id) as orders_handled,
    round(100.0 * sum(case when po.status = 'payee' then 1 else 0 end) / nullif(count(distinct po.id), 0), 2) as completion_rate,
    count(claim.id) as faults
  from employees e
  left join pipeline_comments pc on e.id = pc.author_id
  left join pipeline_orders po on e.id = po.assigned_to
  left join claims claim on po.id = claim.order_id
  group by e.id, e.first_name;
