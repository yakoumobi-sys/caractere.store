-- ============================================================================
-- Fonctions et Triggers — Auto-numérotation et automatisations
-- ============================================================================

-- ============================================================================
-- Auto-numérotation des commandes (CMD-YYYY-00001)
-- ============================================================================

create or replace function generate_order_number()
returns text as $$
declare
  year integer;
  count integer;
  number text;
begin
  year := extract(year from now());
  select count(*) into count from pipeline_orders
    where extract(year from created_at) = year;
  number := format('CMD-%s-%05s', year, (count + 1)::text);
  return number;
end;
$$ language plpgsql;

-- Trigger pour auto-numéroter les commandes
create or replace function auto_number_order()
returns trigger as $$
begin
  if new.number is null then
    new.number := generate_order_number();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_order_number on pipeline_orders;
create trigger set_order_number
  before insert on pipeline_orders
  for each row
  execute function auto_number_order();

-- ============================================================================
-- Auto-numérotation des réclamations (REC-YYYY-00001)
-- ============================================================================

create or replace function generate_claim_number()
returns text as $$
declare
  year integer;
  count integer;
  number text;
begin
  year := extract(year from now());
  select count(*) into count from claims
    where extract(year from created_at) = year;
  number := format('REC-%s-%05s', year, (count + 1)::text);
  return number;
end;
$$ language plpgsql;

create or replace function auto_number_claim()
returns trigger as $$
begin
  if new.number is null then
    new.number := generate_claim_number();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_claim_number on claims;
create trigger set_claim_number
  before insert on claims
  for each row
  execute function auto_number_claim();

-- ============================================================================
-- updated_at automatique sur toutes les tables
-- ============================================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_pipeline_orders_updated_at on pipeline_orders;
create trigger update_pipeline_orders_updated_at before update on pipeline_orders
  for each row execute function update_updated_at();

drop trigger if exists update_employees_updated_at on employees;
create trigger update_employees_updated_at before update on employees
  for each row execute function update_updated_at();

drop trigger if exists update_contacts_updated_at on contacts;
create trigger update_contacts_updated_at before update on contacts
  for each row execute function update_updated_at();

drop trigger if exists update_products_updated_at on products;
create trigger update_products_updated_at before update on products
  for each row execute function update_updated_at();

drop trigger if exists update_production_tasks_updated_at on production_tasks;
create trigger update_production_tasks_updated_at before update on production_tasks
  for each row execute function update_updated_at();

drop trigger if exists update_claims_updated_at on claims;
create trigger update_claims_updated_at before update on claims
  for each row execute function update_updated_at();

-- ============================================================================
-- Automatisation du paiement à la confirmation de livraison Yalidine
-- ============================================================================

create or replace function mark_as_paid_on_confirmation()
returns trigger as $$
begin
  if new.delivery_confirmed_at is not null and new.paid_at is null then
    new.paid_at := now();
    new.status := 'payee';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists auto_mark_paid on pipeline_orders;
create trigger auto_mark_paid
  before update on pipeline_orders
  for each row
  execute function mark_as_paid_on_confirmation();

-- ============================================================================
-- Fonction pour créer les écritures comptables automatiquement
-- ============================================================================

create or replace function create_journal_entries_for_order()
returns trigger as $$
begin
  if new.status = 'payee' and old.status != 'payee' then
    -- Créer les entrées comptables pour la vente
    insert into journal_entries (order_id, account_code, description, amount, entry_type)
    values
      (new.id, '411000', 'Vente commande ' || new.number, new.amount_paid, 'credit'),
      (new.id, '701000', 'Revenu vente ' || new.number, new.amount_paid, 'debit');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists auto_journal_entries on pipeline_orders;
create trigger auto_journal_entries
  after update on pipeline_orders
  for each row
  execute function create_journal_entries_for_order();
