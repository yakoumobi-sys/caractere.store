-- ============================================================================
-- Système d'alertes de fournitures — Tous les employés
-- ============================================================================

-- Table des alertes de fournitures
create table if not exists supply_alerts (
  id uuid default gen_random_uuid() primary key,
  number text unique not null,
  alert_type text not null, -- 'paper_dtf', 'ink_dtf', 'powder_dtf', 'misc'
  department text not null, -- 'DTF', 'Broderie', 'Flocage', 'Autre'
  title text not null,
  description text,
  priority text default 'normal', -- 'low', 'normal', 'high', 'urgent'
  status text default 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  created_by uuid references employees(id),
  assigned_to uuid references employees(id),
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-numérotation des alertes (ALR-YYYY-00001)
create or replace function generate_alert_number()
returns text as $$
declare
  year integer;
  count integer;
  number text;
begin
  year := extract(year from now());
  select count(*) into count from supply_alerts
    where extract(year from created_at) = year;
  number := format('ALR-%s-%05s', year, (count + 1)::text);
  return number;
end;
$$ language plpgsql;

create or replace function auto_number_alert()
returns trigger as $$
begin
  if new.number is null then
    new.number := generate_alert_number();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_alert_number on supply_alerts;
create trigger set_alert_number
  before insert on supply_alerts
  for each row
  execute function auto_number_alert();

-- Trigger updated_at
drop trigger if exists update_supply_alerts_updated_at on supply_alerts;
create trigger update_supply_alerts_updated_at before update on supply_alerts
  for each row
  execute function update_updated_at();

-- ============================================================================
-- VUE : Alertes avec détails créateur et assigné
-- ============================================================================

create or replace view supply_alerts_view as
  select
    sa.*,
    ec.first_name as created_by_first_name,
    ec.color as created_by_color,
    ea.first_name as assigned_to_first_name,
    ea.color as assigned_to_color
  from supply_alerts sa
  left join employees ec on sa.created_by = ec.id
  left join employees ea on sa.assigned_to = ea.id;

-- ============================================================================
-- DONNÉES DE RÉFÉRENCE : Types d'alertes par département
-- ============================================================================

create table if not exists supply_types (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  name text not null,
  department text not null,
  description text,
  created_at timestamptz default now()
);

insert into supply_types (code, name, department, description)
values
  ('paper_dtf', 'Papier DTF', 'DTF', 'Papier pour impression DTF'),
  ('ink_dtf', 'Encre DTF', 'DTF', 'Encre pour imprimante DTF'),
  ('powder_dtf', 'Poudre DTF', 'DTF', 'Poudre de fixation DTF'),
  ('tape_broderie', 'Ruban de stabilisation', 'Broderie', 'Ruban pour broderie'),
  ('thread_broderie', 'Fil broderie', 'Broderie', 'Fil de broderie coloré'),
  ('film_flocage', 'Film flocage', 'Flocage', 'Film pour flocage thermique'),
  ('glue_flocage', 'Colle flocage', 'Flocage', 'Colle pour flocage'),
  ('misc', 'Autre fourniture', 'Autre', 'Autre fourniture ou équipement')
on conflict (code) do nothing;
