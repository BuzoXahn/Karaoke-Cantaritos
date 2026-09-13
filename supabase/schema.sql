-- Karaoke Cantaritos: correr una sola vez en el SQL Editor de Supabase

create table public.solicitudes (
  id uuid primary key default gen_random_uuid(),
  mesa int not null check (mesa between 1 and 200),
  cancion text not null check (char_length(cancion) between 1 and 120),
  artista text not null check (char_length(artista) between 1 and 120),
  cantante text not null check (char_length(cantante) between 1 and 80),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'cantada')),
  created_at timestamptz not null default now()
);

alter table public.solicitudes enable row level security;

-- Cualquiera (clientes con el QR) puede pedir canción
create policy "clientes insertan pendientes"
  on public.solicitudes for insert
  to anon
  with check (estado = 'pendiente');

-- Cualquiera puede ver la fila (para mostrar el lugar en la fila)
create policy "todos ven la fila"
  on public.solicitudes for select
  to anon, authenticated
  using (true);

-- Solo el DJ (usuario autenticado) modifica o elimina
create policy "dj actualiza"
  on public.solicitudes for update
  to authenticated
  using (true) with check (true);

create policy "dj elimina"
  on public.solicitudes for delete
  to authenticated
  using (true);

-- Tiempo real para la cabina del DJ
alter publication supabase_realtime add table public.solicitudes;
