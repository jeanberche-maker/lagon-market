-- ============================================================
-- Lagon Market — schéma Supabase v2 (Lot 15 + Lot 16)
-- À coller dans Supabase → SQL Editor → Run (idempotent :
-- peut être ré-exécuté sans risque sur un projet existant).
--
-- Modèle d'accès :
--   • products : lecture publique (clé anon) · écriture réservée
--     au marchand authentifié (Supabase Auth, session Espace boutique)
--   • orders   : création par les clients anonymes · lecture réservée
--     au marchand authentifié
-- ============================================================

create table if not exists products (
  id     text primary key,
  n      text not null,
  n_en   text,
  b      text default '',
  f      text default '',
  f_en   text,
  pr     numeric not null default 0 check (pr >= 0),
  u      text default '',
  e      text default '🛒',
  g      jsonb default '["#E3F4F4","#9CCFE0"]'::jsonb,
  cat    text not null default 'epicerie',
  sub    text default '',
  bd     jsonb default '[]'::jsonb,
  st     integer not null default 0 check (st >= 0),
  d      text default '',
  d_en   text,
  ph     text,
  cr     text,
  promo  boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id       bigserial primary key,
  created_at timestamptz not null default now(),
  customer text default '',
  slot     text default '',
  total    numeric not null default 0,
  items    jsonb default '[]'::jsonb,
  note     text default '',
  promo    text default '',
  status   smallint not null default 1
);

-- ---------------- RLS ----------------
alter table products enable row level security;
alter table orders   enable row level security;

-- Suppression des policies permissives du Lot 15 (prototype),
-- puis création des policies restreintes du Lot 16.
drop policy if exists "marchand publie produits" on products;
drop policy if exists "marchand modifie produits" on products;
drop policy if exists "lecture commandes" on orders;
drop policy if exists "lecture publique produits" on products;
drop policy if exists "clients créent commandes" on orders;

-- products : lecture publique
create policy "lecture publique produits" on products
  for select to anon, authenticated using (true);

-- products : écriture UNIQUEMENT authentifiée (marchand connecté)
create policy "marchand authentifié publie produits" on products
  for insert to authenticated with check (true);

create policy "marchand authentifié modifie produits" on products
  for update to authenticated using (true) with check (true);

-- orders : les clients anonymes peuvent commander…
create policy "clients créent commandes" on orders
  for insert to anon, authenticated with check (true);

-- …mais seul le marchand authentifié peut les LIRE.
create policy "marchand lit les commandes" on orders
  for select to authenticated using (true);

-- ---------------- Créer le compte marchand ----------------
-- Option A (recommandée) : Supabase → Authentication → Users →
--   « Add user → Create new user » (email + mot de passe,
--   « Auto Confirm User » coché), puis connectez-vous dans
--   l'Espace boutique avec ces identifiants.
-- Option B : laissez l'Espace boutique créer le compte
--   (« Créer le compte ») ; si Supabase exige la confirmation par
--   email, désactivez-la : Authentication → Sign In / Providers →
--   Email → « Confirm email » OFF.
