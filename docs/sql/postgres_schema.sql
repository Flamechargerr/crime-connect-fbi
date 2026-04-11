-- CrimeConnect relational schema (PostgreSQL/Supabase-ready)
-- This schema mirrors the analytics domain used by the Python API.

create extension if not exists pgcrypto;

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  status text not null check (status in ('active', 'backlog', 'archived')),
  priority text not null,
  owner text not null,
  notes integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists intel_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists timelines (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists transmissions (
  id uuid primary key default gen_random_uuid(),
  codename text not null,
  agent text not null,
  channel text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists ml_model_runs (
  id uuid primary key default gen_random_uuid(),
  model_name text not null,
  algorithm text not null,
  training_records integer not null,
  test_records integer not null,
  accuracy numeric(5,4) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_cases_status on cases(status);
create index if not exists idx_cases_updated_at on cases(updated_at desc);
create index if not exists idx_intel_created_at on intel_events(created_at desc);
create index if not exists idx_timelines_created_at on timelines(created_at desc);
