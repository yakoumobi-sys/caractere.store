-- ============================================================================
-- FLOCAGE WORKFLOW - Support pour flocage optionnel après DTF
-- ============================================================================

-- Ajouter colonne pour indiquer si flocage est requis
alter table public.pipeline_orders
add column if not exists requires_flocage boolean default false;

-- Index pour améliorer les queries
create index if not exists idx_pipeline_orders_requires_flocage on pipeline_orders(requires_flocage);
create index if not exists idx_pipeline_orders_technique on pipeline_orders(technique);
