-- Quote requests are written by the server and read only through the admin API.
-- Browser roles have no access, even for authenticated customers.
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  nom text not null check (char_length(nom) between 2 and 100),
  telephone text not null check (char_length(telephone) between 8 and 20),
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'nouveau' check (status in ('nouveau', 'contacte', 'termine')),
  created_at timestamptz not null default now()
);
alter table public.contact_requests enable row level security;
revoke all on public.contact_requests from public, anon, authenticated;
grant select, insert, update on public.contact_requests to service_role;
create index contact_requests_created_at_idx on public.contact_requests (created_at desc);
comment on table public.contact_requests is 'Private quote inbox. Access through server API after admin authorization only.';
