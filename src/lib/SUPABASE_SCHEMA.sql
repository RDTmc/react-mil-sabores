-- (ya lo tienes en tu copia previa)-- ============================================
-- React Mil Sabores – Supabase PostgreSQL Schema
-- Tablas + RLS + Policies + Seed
-- ============================================

-- Extensión necesaria para gen_random_uuid()
create extension if not exists pgcrypto;

-- =========================
-- 1) Tablas principales
-- =========================

create table if not exists public.categories (
  id serial primary key,
  name text unique not null
);

create table if not exists public.products (
  id text primary key,                          -- ej: 'TC001'
  category_id integer references public.categories(id) on delete set null,
  name text not null,
  price integer not null,                       -- CLP
  image_path text,                              -- ruta o URL
  description text,
  tags text[],                                  -- ej: array['tradicional']
  sizes text[]                                  -- ej: array['8 porciones','10 porciones']
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_name on public.products using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));

create table if not exists public.featured_products (
  product_id text references public.products(id) on delete cascade,
  position integer default 0,
  primary key(product_id)
);

-- Órdenes (para futuras iteraciones)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending',
  total integer not null default 0,             -- total CLP
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_user on public.orders(user_id, created_at desc);

create table if not exists public.order_items (
  order_id uuid references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete restrict,
  qty integer not null check (qty > 0),
  price_each integer not null,
  size text,
  primary key(order_id, product_id, size)
);

create index if not exists idx_order_items_order on public.order_items(order_id);

-- =========================
-- 2) Row Level Security
-- =========================
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.featured_products enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;

-- =========================
-- 3) Policies
-- =========================
-- Catálogo de lectura pública (anon incluído)
do $$
begin
  if not exists (select 1 from pg_policies where polname = 'categories_read') then
    create policy categories_read on public.categories
      for select using (true);
  end if;

  if not exists (select 1 from pg_policies where polname = 'products_read') then
    create policy products_read on public.products
      for select using (true);
  end if;

  if not exists (select 1 from pg_policies where polname = 'featured_read') then
    create policy featured_read on public.featured_products
      for select using (true);
  end if;

  -- Órdenes: solo el dueño puede ver, crear, actualizar y eliminar
  if not exists (select 1 from pg_policies where polname = 'orders_select_own') then
    create policy orders_select_own on public.orders
      for select using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where polname = 'orders_insert_owner') then
    create policy orders_insert_owner on public.orders
      for insert with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where polname = 'orders_update_own') then
    create policy orders_update_own on public.orders
      for update using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where polname = 'orders_delete_own') then
    create policy orders_delete_own on public.orders
      for delete using (auth.uid() = user_id);
  end if;

  -- Items de la orden: sólo si pertenecen a una orden del usuario
  if not exists (select 1 from pg_policies where polname = 'order_items_select_own') then
    create policy order_items_select_own on public.order_items
      for select using (
        exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
      );
  end if;

  if not exists (select 1 from pg_policies where polname = 'order_items_insert_own') then
    create policy order_items_insert_own on public.order_items
      for insert with check (
        exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
      );
  end if;

  if not exists (select 1 from pg_policies where polname = 'order_items_update_own') then
    create policy order_items_update_own on public.order_items
      for update using (
        exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
      );
  end if;

  if not exists (select 1 from pg_policies where polname = 'order_items_delete_own') then
    create policy order_items_delete_own on public.order_items
      for delete using (
        exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
      );
  end if;
end
$$;

-- =========================
-- 4) Seed (desde tus JSON)
-- =========================

-- Categorías
insert into public.categories(name) values
  ('Tortas Cuadradas'),
  ('Tortas Circulares'),
  ('Postres Individuales'),
  ('Sin Azúcar'),
  ('Sin Gluten'),
  ('Vegano'),
  ('Tortas Especiales')
on conflict (name) do nothing;

-- Productos
-- Nota: usamos subselect para mapear category_id por nombre
insert into public.products(id, category_id, name, price, image_path, description, tags, sizes) values
  ('TC001', (select id from public.categories where name = 'Tortas Cuadradas'),
    'Torta Cuadrada de Chocolate', 45000, 'img/tc_chocolate.png',
    'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.',
    array['tradicional'], array['8 porciones','10 porciones','12 porciones']),
  ('TC002', (select id from public.categories where name = 'Tortas Cuadradas'),
    'Torta Cuadrada de Frutas', 50000, 'img/tc_frutas.png',
    'Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.',
    array['tradicional'], null),
  ('TT001', (select id from public.categories where name = 'Tortas Circulares'),
    'Torta Circular de Vainilla', 40000, 'img/tt_vainilla.png',
    'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.',
    array['tradicional'], null),
  ('TT002', (select id from public.categories where name = 'Tortas Circulares'),
    'Torta Circular de Manjar', 42000, 'img/tt_manjar.png',
    'Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.',
    array['tradicional'], null),
  ('PI001', (select id from public.categories where name = 'Postres Individuales'),
    'Mousse de Chocolate', 5000, 'img/pi_mousse.png',
    'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.',
    array['individual'], null),
  ('PI002', (select id from public.categories where name = 'Postres Individuales'),
    'Tiramisú Clásico', 5500, 'img/pi_tiramisu.png',
    'Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.',
    array['individual'], null),
  ('PSA001', (select id from public.categories where name = 'Sin Azúcar'),
    'Torta Sin Azúcar de Naranja', 48000, 'img/psa_naranja.png',
    'Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.',
    array['sin azúcar'], null),
  ('PSA002', (select id from public.categories where name = 'Sin Azúcar'),
    'Cheesecake Sin Azúcar', 47000, 'img/psa_cheesecake.png',
    'Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.',
    array['sin azúcar'], null),
  ('PG001', (select id from public.categories where name = 'Sin Gluten'),
    'Brownie Sin Gluten', 4000, 'img/pg_brownie.png',
    'Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.',
    array['sin gluten'], null),
  ('PG002', (select id from public.categories where name = 'Sin Gluten'),
    'Pan Sin Gluten', 3500, 'img/pg_pan.png',
    'Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.',
    array['sin gluten'], null),
  ('PV001', (select id from public.categories where name = 'Vegano'),
    'Torta Vegana de Chocolate', 50000, 'img/pv_chocolate.png',
    'Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.',
    array['vegano'], null),
  ('PV002', (select id from public.categories where name = 'Vegano'),
    'Galletas Veganas de Avena', 4500, 'img/pv_avena.png',
    'Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.',
    array['vegano'], null),
  ('TE001', (select id from public.categories where name = 'Tortas Especiales'),
    'Torta Especial de Cumpleaños', 55000, 'img/te_cumple.png',
    'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.',
    array['especial'], null),
  ('TE002', (select id from public.categories where name = 'Tortas Especiales'),
    'Torta Especial de Boda', 60000, 'img/te_boda.png',
    'Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.',
    array['especial'], null)
on conflict (id) do update set
  category_id = excluded.category_id,
  name        = excluded.name,
  price       = excluded.price,
  image_path  = excluded.image_path,
  description = excluded.description,
  tags        = excluded.tags,
  sizes       = excluded.sizes;

-- Destacados (ordenados por position)
-- Según tu JSON de productos-destacados: TC001, TT001, PI001, PSA001
insert into public.featured_products(product_id, position) values
  ('TC001', 0),
  ('TT001', 1),
  ('PI001', 2),
  ('PSA001', 3)
on conflict (product_id) do update set position = excluded.position;

-- =========================
-- 5) Notas de uso
-- =========================
-- - Para que las imágenes funcionen en desarrollo si usas rutas 'img/...':
--   copia tu carpeta /img a /public/img en el proyecto Vite.
-- - En producción puedes migrar imágenes a Supabase Storage (bucket 'public')
--   y reemplazar image_path por URL pública o firmada.
-- - Las tablas de órdenes tienen RLS por usuario; catálogo es público (solo SELECT).

-- Fin del script
