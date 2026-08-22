-- ============================================================================
-- Intégration Yalidine — Plateforme de livraison Algérienne
-- ============================================================================

-- Ajouter colonnes pour le suivi Yalidine
alter table public.pipeline_orders
add column if not exists yalidine_tracking text unique,
add column if not exists yalidine_parcel text,
add column if not exists yalidine_status text default 'pending', -- pending, in_transit, delivered, failed, cancelled
add column if not exists yalidine_created_at timestamptz,
add column if not exists yalidine_updated_at timestamptz;

-- Ajouter colonne pour le type de livraison
alter table public.pipeline_orders
add column if not exists delivery_type integer default 1; -- 1 = Yalidine, 2 = Alger Livraison

-- ============================================================================
-- Table d'historique Yalidine (pour les webhooks et mises à jour)
-- ============================================================================

create table if not exists yalidine_tracking_history (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references pipeline_orders(id) on delete cascade,
  tracking_number text,
  parcel_number text,
  previous_status text,
  new_status text,
  status_ar text,
  wilaya text,
  location text,
  updated_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================================
-- Trigger : Automatiser la création d'historique lors des changements
-- ============================================================================

create or replace function log_yalidine_status_change()
returns trigger as $$
begin
  if new.yalidine_status != old.yalidine_status then
    insert into yalidine_tracking_history (
      order_id,
      tracking_number,
      parcel_number,
      previous_status,
      new_status,
      updated_at
    ) values (
      new.id,
      new.yalidine_tracking,
      new.yalidine_parcel,
      old.yalidine_status,
      new.yalidine_status,
      now()
    );
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists log_yalidine_change on pipeline_orders;
create trigger log_yalidine_change
  after update on pipeline_orders
  for each row
  when (old.yalidine_status is distinct from new.yalidine_status)
  execute function log_yalidine_status_change();

-- ============================================================================
-- Trigger : Mettre à jour l'ordre quand Yalidine livre
-- ============================================================================

create or replace function auto_confirm_on_yalidine_delivery()
returns trigger as $$
begin
  if new.yalidine_status = 'delivered' and old.yalidine_status != 'delivered' then
    -- Marquer comme livré et paiement confirmé
    update pipeline_orders
    set
      status = 'payee',
      delivery_confirmed_at = now(),
      paid_at = now()
    where id = new.order_id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists auto_delivery_confirmation on yalidine_tracking_history;
create trigger auto_delivery_confirmation
  after insert on yalidine_tracking_history
  for each row
  when (new.new_status = 'delivered')
  execute function auto_confirm_on_yalidine_delivery();

-- ============================================================================
-- VUE : Commandes avec info Yalidine
-- ============================================================================

create or replace view yalidine_shipments_view as
  select
    po.id,
    po.number as order_number,
    po.contact_name,
    po.amount_paid,
    po.yalidine_tracking,
    po.yalidine_parcel,
    po.yalidine_status,
    po.yalidine_created_at,
    po.yalidine_updated_at,
    po.delivery_type,
    e.first_name as assigned_to,
    e.color as assignee_color,
    case
      when po.yalidine_status = 'pending' then '⏳'
      when po.yalidine_status = 'in_transit' then '🚚'
      when po.yalidine_status = 'delivered' then '✅'
      when po.yalidine_status = 'failed' then '❌'
      when po.yalidine_status = 'cancelled' then '🚫'
      else '❓'
    end as status_icon
  from pipeline_orders po
  left join employees e on po.assigned_to = e.id
  where po.yalidine_tracking is not null
  order by po.yalidine_created_at desc;

-- ============================================================================
-- Fonction : Statut lisible Yalidine
-- ============================================================================

create or replace function get_yalidine_status_label(status text)
returns text as $$
begin
  case status
    when 'pending' then return '⏳ En attente de récupération';
    when 'in_transit' then return '🚚 En transit';
    when 'delivered' then return '✅ Livré';
    when 'failed' then return '❌ Échec de livraison';
    when 'cancelled' then return '🚫 Annulé';
    else return '❓ ' || status;
  end case;
end;
$$ language plpgsql;
