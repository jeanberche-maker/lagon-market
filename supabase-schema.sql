-- ============================================================
-- Lagon Market — schéma Supabase (Lot 15, backend optionnel)
-- À coller dans Supabase → SQL Editor → Run.
-- L'app lit `products` (REST, clé anon) et écrit dans `orders`.
-- ============================================================

create table if not exists products (
  id     text primary key,          -- identifiant stable du produit (slug)
  n      text not null,             -- nom (FR)
  n_en   text,                      -- nom (EN, facultatif)
  b      text default '',           -- marque
  f      text default '',           -- format (ex. « la pièce », « 500 g »)
  f_en   text,                      -- format (EN, facultatif)
  pr     numeric not null default 0 check (pr >= 0),  -- prix en euros
  u      text default '',           -- unité affichée (kg, L, …)
  e      text default '🛒',         -- emoji de remplacement si pas de photo
  g      jsonb default '["#E3F4F4","#9CCFE0"]'::jsonb, -- dégradé de fond [from,to]
  cat    text not null default 'epicerie',
  sub    text default '',
  bd     jsonb default '[]'::jsonb, -- badges : frais, bio, import, sg, nouveau
  st     integer not null default 0 check (st >= 0),   -- stock (0 = rupture)
  d      text default '',           -- description (FR)
  d_en   text,                      -- description (EN, facultatif)
  ph     text,                      -- URL photo (https)
  cr     text,                      -- crédit photo
  promo  boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id       bigserial primary key,
  created_at timestamptz not null default now(),
  customer text default '',          -- adresse de livraison (texte)
  slot    text default '',           -- créneau choisi
  total   numeric not null default 0,
  items   jsonb default '[]'::jsonb, -- [{id, q}]
  note    text default '',
  promo   text default '',
  status  smallint not null default 1  -- 1 confirmée · 2 en cours · 3 livrée · 4 annulée
);

-- ---------------- RLS (prototype : permissif clé anon) ----------------
-- ⚠️ Prototype seulement : la clé anon peut lire les produits et écrire
-- des commandes, et le marchand publie le catalogue. Pour la production,
-- ajouter Supabase Auth et restreindre l'écriture aux utilisateurs authentifiés.
alter table products enable row level security;
alter table orders   enable row level security;

drop policy if exists "lecture publique produits" on products;
create policy "lecture publique produits" on products
  for select to anon, authenticated using (true);

drop policy if exists "marchand publie produits" on products;
create policy "marchand publie produits" on products
  for insert to anon, authenticated with check (true);

drop policy if exists "marchand modifie produits" on products;
create policy "marchand modifie produits" on products
  for update to anon, authenticated using (true) with check (true);

drop policy if exists "clients créent commandes" on orders;
create policy "clients créent commandes" on orders
  for insert to anon, authenticated with check (true);

drop policy if exists "lecture commandes" on orders;
create policy "lecture commandes" on orders
  for select to anon, authenticated using (true);

-- ---------------- Données de départ (optionnel) ----------------
-- Le plus simple : dans l'Espace boutique (admin.html), configurez le
-- backend puis « 🚀 Publier le catalogue vers le backend » — il envoie
-- tout le catalogue courant en un seul upsert.
