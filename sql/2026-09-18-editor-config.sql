-- DiseñosGratis: configuración escalable para editores de plantillas
-- Ejecutar cuando estén listos los fondos limpios de Baby Shower y Dragon Ball.

ALTER TABLE public.designs
ADD COLUMN IF NOT EXISTS editor_config jsonb;

-- Los dos assets se pueden identificar desde ahora como futuras invitaciones
-- sin exponer el botón de edición hasta tener background/config listos.
UPDATE public.designs
SET editor_type = 'invitation',
    is_editable = false
WHERE slug IN (
  'plantilla-invitacion-baby-shower-borreguito',
  'invitacion-cumpleanos-editable-dragon-ball'
);

-- Recomendación de producción:
-- background fuente: 1500x2100 px (5x7 a 300 ppp)
-- canvas lógico: 750x1050; exportación: 1500x2100.
--
-- Ejemplo de editor_config (NO ejecutar hasta tener URLs/posiciones definitivas):
--
-- UPDATE public.designs
-- SET editor_config = '{
--   "version": 1,
--   "canvas": {
--     "width": 750,
--     "height": 1050,
--     "exportWidth": 1500,
--     "exportHeight": 2100
--   },
--   "backgroundUrl": "https://.../baby-shower-background.webp",
--   "textFields": [
--     {
--       "id": "name",
--       "label": "Nombre",
--       "defaultText": "Mateo",
--       "x": 375,
--       "y": 470,
--       "width": 520,
--       "fontFamily": "Times New Roman",
--       "fontSize": 58,
--       "fill": "#8fc9d4",
--       "textAlign": "center"
--     }
--   ]
-- }'::jsonb
-- WHERE slug = 'plantilla-invitacion-baby-shower-borreguito';
