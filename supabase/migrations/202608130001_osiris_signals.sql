create table if not exists public.osiris_signals (
  id text primary key,
  domain text not null,
  title text not null,
  summary text not null default '',
  source text not null,
  url text,
  published_at timestamptz,
  observed_at timestamptz not null,
  first_observed_at timestamptz not null default now(),
  last_observed_at timestamptz not null default now(),
  observation_count integer not null default 1,
  confidence double precision not null default 0,
  tags jsonb not null default '[]'::jsonb,
  entities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists osiris_signals_domain_idx on public.osiris_signals(domain);
create index if not exists osiris_signals_observed_idx on public.osiris_signals(last_observed_at desc);
create index if not exists osiris_signals_source_idx on public.osiris_signals(source);

create or replace function public.osiris_signals_before_update()
returns trigger
language plpgsql
as $$
begin
  new.last_observed_at = greatest(coalesce(old.last_observed_at, new.observed_at), new.observed_at);
  new.first_observed_at = least(coalesce(old.first_observed_at, new.observed_at), new.observed_at);
  new.observation_count = coalesce(old.observation_count, 0) + 1;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists osiris_signals_before_update on public.osiris_signals;
create trigger osiris_signals_before_update
before update on public.osiris_signals
for each row execute function public.osiris_signals_before_update();

alter table public.osiris_signals enable row level security;
