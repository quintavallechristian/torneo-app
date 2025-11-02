create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id bigint references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Indici utili
create index on public.notifications (profile_id);
create index on public.notifications (read);