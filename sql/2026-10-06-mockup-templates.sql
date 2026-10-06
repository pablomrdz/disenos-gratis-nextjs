-- Database-backed, SEO-ready mockup templates.
-- Applied to Supabase production on 2026-10-06.

create table if not exists public.mockup_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  h1 text not null,
  title text not null,
  meta_title text not null,
  meta_description text not null,
  intro text not null,
  background_url text not null,
  background_alt text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  print_area jsonb not null,
  aspect_ratio text not null,
  format_label text not null,
  primary_keyword text not null,
  secondary_keywords text[] not null default '{}'::text[],
  seo_content jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mockup_templates_print_area_shape check (
    jsonb_typeof(print_area) = 'object'
    and print_area ?& array['left', 'top', 'width', 'height']
  )
);

alter table public.mockup_templates enable row level security;
grant select on table public.mockup_templates to anon, authenticated;

drop policy if exists "Public can read active mockup templates" on public.mockup_templates;
create policy "Public can read active mockup templates"
on public.mockup_templates
for select
to anon, authenticated
using (is_active = true);
