-- ============================================================================
-- SYSTÈME D'AUTHENTIFICATION - Authentification par employé
-- ============================================================================

-- Ajouter les colonnes d'authentification à la table employees
alter table public.employees
add column if not exists password_hash text,
add column if not exists password_set_at timestamptz,
add column if not exists last_login_at timestamptz,
add column if not exists is_active boolean default true;

-- Créer une table pour les sessions
create table if not exists employee_sessions (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid not null references employees(id) on delete cascade,
  token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Index pour les sessions actives
create index if not exists idx_employee_sessions_token on employee_sessions(token);
create index if not exists idx_employee_sessions_employee_id on employee_sessions(employee_id);
create index if not exists idx_employee_sessions_expires_at on employee_sessions(expires_at);

-- Créer une table pour l'historique de login
create table if not exists employee_login_history (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid not null references employees(id) on delete cascade,
  login_at timestamptz default now(),
  ip_address text,
  user_agent text,
  success boolean default true
);

-- Index pour l'historique
create index if not exists idx_employee_login_history_employee_id on employee_login_history(employee_id);
create index if not exists idx_employee_login_history_login_at on employee_login_history(login_at);

-- ============================================================================
-- POLITIQUE DE SÉCURITÉ
-- ============================================================================

-- Les employés ne peuvent voir que leurs propres données de session
alter table employee_sessions enable row level security;

create policy "employees_can_view_own_sessions" on employee_sessions
  for select
  using (employee_id = auth.uid());

create policy "system_can_manage_sessions" on employee_sessions
  for all
  using (true);

-- Les données de login history ne sont accessibles qu'au système
alter table employee_login_history enable row level security;

create policy "login_history_system_only" on employee_login_history
  for all
  using (false)
  with check (false);
