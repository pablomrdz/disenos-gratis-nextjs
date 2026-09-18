-- DiseñosGratis: corregir URLs de fondo para los editores de invitaciones.
-- Ejecutar en Supabase después de este cambio de código.

BEGIN;

UPDATE public.designs
SET
  editor_type = 'invitation',
  is_editable = true,
  editor_config = jsonb_set(
    COALESCE(editor_config, '{}'::jsonb),
    '{backgroundUrl}',
    to_jsonb('https://fsn1.your-objectstorage.com/disenosgratis/uploads/2026/09/Archivo-fuente-invitacion-baby-shower.webp'::text),
    true
  )
WHERE slug = 'plantilla-invitacion-baby-shower-borreguito';

UPDATE public.designs
SET
  editor_type = 'invitation',
  is_editable = true,
  editor_config = jsonb_set(
    COALESCE(editor_config, '{}'::jsonb),
    '{backgroundUrl}',
    to_jsonb('https://fsn1.your-objectstorage.com/disenosgratis/uploads/2026/09/Archivo_fuente_invitacion_Deagon-ball.webp'::text),
    true
  )
WHERE slug = 'invitacion-cumpleanos-editable-dragon-ball';

COMMIT;

SELECT
  slug,
  is_editable,
  editor_type,
  editor_config->>'backgroundUrl' AS background_url
FROM public.designs
WHERE slug IN (
  'plantilla-invitacion-baby-shower-borreguito',
  'invitacion-cumpleanos-editable-dragon-ball'
)
ORDER BY slug;
