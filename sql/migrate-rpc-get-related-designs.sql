-- ============================================================================
-- MIGRACIÓN: Optimizar RPC get_related_designs para reducir PostgREST Egress
-- ============================================================================
-- ANTES:  SELECT * FROM designs (devolvía description, content, gallery_urls, etc.)
-- DESPUÉS: Solo proyecta las columnas necesarias para las tarjetas de diseño.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================================

CREATE OR REPLACE FUNCTION get_related_designs(
  design_id UUID,
  category_name TEXT,
  limit_count INTEGER DEFAULT 4
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  image_url TEXT,
  category TEXT,
  downloads INTEGER,
  alt_text TEXT,
  excerpt TEXT,
  font_family TEXT,
  is_vip BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.slug,
    d.image_url,
    d.category,
    d.downloads,
    d.alt_text,
    d.excerpt,
    d.font_family,
    d.is_vip
  FROM designs d
  WHERE d.id != design_id
    AND d.category ILIKE '%' || category_name || '%'
  ORDER BY d.created_at DESC
  LIMIT limit_count;
END;
$$;
