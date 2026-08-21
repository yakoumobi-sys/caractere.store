-- ================================================
-- SCHÉMA SUPABASE — JARVIS (assistant personnel)
-- Coller dans : Supabase > SQL Editor > New query
-- Espace 100% privé, réservé à ADMIN_EMAIL (cf. lib/api-auth.ts)
-- ================================================

-- Tâches (todo perso / pro)
create table if not exists jarvis_tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  notes text,
  due_date date,
  due_time text,
  priority text default 'normale' check (priority in ('basse','normale','haute')),
  category text default 'perso',
  status text default 'a_faire' check (status in ('a_faire','en_cours','fait')),
  created_at timestamptz default now()
);

-- Événements (rdv, réunions, déjeuners, dîners, appels)
create table if not exists jarvis_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text default 'rdv' check (type in ('reunion','dejeuner','diner','rdv','appel','autre')),
  with_person text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- Dépenses / revenus
create table if not exists jarvis_transactions (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('revenu','depense')),
  amount numeric not null default 0,
  currency text default 'DA',
  category text default 'autre',
  description text,
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Objectifs (vie perso / pro)
create table if not exists jarvis_goals (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text default 'perso',
  target_date date,
  progress integer default 0 check (progress between 0 and 100),
  status text default 'en_cours' check (status in ('en_cours','atteint','abandonne')),
  created_at timestamptz default now()
);

-- Projets
create table if not exists jarvis_projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status text default 'actif' check (status in ('actif','en_pause','termine')),
  progress integer default 0 check (progress between 0 and 100),
  deadline date,
  created_at timestamptz default now()
);

-- Historique de conversation avec JARVIS (mémoire de l'assistant)
create table if not exists jarvis_messages (
  id uuid default gen_random_uuid() primary key,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists jarvis_tasks_due_date_idx on jarvis_tasks (due_date);
create index if not exists jarvis_events_start_at_idx on jarvis_events (start_at);
create index if not exists jarvis_transactions_date_idx on jarvis_transactions (date);
create index if not exists jarvis_messages_created_at_idx on jarvis_messages (created_at);
