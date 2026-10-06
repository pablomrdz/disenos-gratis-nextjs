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


insert into public.mockup_templates (
  slug, h1, title, meta_title, meta_description, intro, background_url, background_alt,
  width, height, print_area, aspect_ratio, format_label, primary_keyword, secondary_keywords,
  seo_content, is_active, sort_order
) values
(
  'mockup-playera-blanca-mujer-historia-instagram',
  'Mockup de playera blanca para historia de Instagram',
  'Mockup de playera blanca para historia de Instagram',
  'Mockup de playera blanca para historia de Instagram gratis',
  'Crea un mockup de playera blanca con modelo para historias de Instagram. Sube tu diseño, ajústalo y descarga tu PNG gratis desde el navegador.',
  'Prueba tu diseño en una playera blanca con modelo y crea una historia vertical lista para presentar tu estampado, diseño DTF o marca.',
  'https://fsn1.your-objectstorage.com/disenosgratis/uploads/2026/10/background-mvp-1.webp',
  'Mockup vertical de mujer con playera blanca lisa para historia de Instagram',
  1080, 1920, '{"left":316,"top":650,"width":448,"height":520}', '9:16',
  'Historia de Instagram (1080 × 1920)', 'mockup playera blanca',
  array['mockup playera','mockup playera mujer','mockup playera con modelo','mockup playera online'],
  '{"summary":"Crea una vista previa vertical de tu diseño sobre una playera blanca. No se sube tu archivo: todo se procesa en tu navegador.","steps":["Sube un PNG, JPG o WEBP de hasta 8 MB.","Arrastra, escala o rota tu diseño dentro del área de estampado.","Descarga el mockup final en PNG para usarlo en historias, catálogos o redes sociales."],"faqs":[{"question":"¿Puedo usar un PNG con fondo transparente?","answer":"Sí. Los PNG transparentes son ideales para colocar logos, diseños DTF e ilustraciones sobre la playera."},{"question":"¿Mi diseño se sube a un servidor?","answer":"No. El archivo se procesa localmente en tu navegador y no se envía a DiseñosGratis, Supabase ni Hetzner."},{"question":"¿Cuál es el tamaño de la descarga?","answer":"La descarga es un PNG vertical de 1080 × 1920 píxeles, listo para una historia de Instagram."}]}'::jsonb,
  true, 10
),
(
  'mockup-playera-blanca-mujer-post-instagram',
  'Mockup de playera blanca para publicación de Instagram',
  'Mockup de playera blanca para publicación de Instagram',
  'Mockup de playera blanca para Instagram gratis',
  'Crea un mockup de playera blanca con modelo para Instagram. Sube tu diseño, ajusta el estampado y descarga un PNG cuadrado gratis.',
  'Visualiza tu diseño en una playera blanca con modelo y prepara una imagen cuadrada para mostrar productos personalizados, estampados o prendas en redes sociales.',
  'https://fsn1.your-objectstorage.com/disenosgratis/uploads/2026/10/background-mvp-2.webp',
  'Mockup cuadrado de mujer con playera blanca lisa para publicación de Instagram',
  1080, 1080, '{"left":316,"top":345,"width":448,"height":430}', '1:1',
  'Publicación de Instagram (1080 × 1080)', 'mockup playera',
  array['mockup playera blanca','mockup camiseta','mockup playera mujer','generador de mockups'],
  '{"summary":"Crea una imagen cuadrada de tu diseño aplicado a una playera blanca. Es una herramienta gratuita y local, sin enviar el archivo a un servidor.","steps":["Elige un diseño PNG, JPG o WEBP de máximo 8 MB.","Ajusta su posición, tamaño y rotación sobre el pecho.","Descarga el PNG cuadrado para una publicación de Instagram, catálogo o tienda en línea."],"faqs":[{"question":"¿Qué formato acepta el generador?","answer":"Acepta PNG, JPG y WEBP de hasta 8 MB. No acepta SVG para mantener la carga segura."},{"question":"¿Puedo mover y girar el diseño?","answer":"Sí. Puedes arrastrarlo, escalarlo desde las esquinas, rotarlo y recentrarlo cuando lo necesites."},{"question":"¿Cuál es el tamaño del mockup final?","answer":"La descarga es un PNG cuadrado de 1080 × 1080 píxeles, ideal para publicaciones de Instagram."}]}'::jsonb,
  true, 20
)
on conflict (slug) do update set
  h1 = excluded.h1,
  title = excluded.title,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  intro = excluded.intro,
  background_url = excluded.background_url,
  background_alt = excluded.background_alt,
  width = excluded.width,
  height = excluded.height,
  print_area = excluded.print_area,
  aspect_ratio = excluded.aspect_ratio,
  format_label = excluded.format_label,
  primary_keyword = excluded.primary_keyword,
  secondary_keywords = excluded.secondary_keywords,
  seo_content = excluded.seo_content,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
