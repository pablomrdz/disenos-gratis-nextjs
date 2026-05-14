-- Migration: Create Taxonomies Table for SEO
-- Execute this script in your Supabase SQL Editor

-- Create enum for taxonomy types if not exists
DO $$ BEGIN
    CREATE TYPE taxonomy_type AS ENUM ('category', 'tag');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.taxonomies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT, -- RichText SEO content
    type taxonomy_type NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure each slug is unique per taxonomy type (e.g., a tag and category can't have the same slug)
    -- Or just unique slug globally if you prefer:
    UNIQUE (slug, type)
);

-- Index for faster queries by slug
CREATE INDEX IF NOT EXISTS taxonomies_slug_idx ON public.taxonomies (slug, type);

-- RLS (Row Level Security)
ALTER TABLE public.taxonomies ENABLE ROW LEVEL SECURITY;

-- Select policy (everyone can read)
CREATE POLICY "Taxonomies are viewable by everyone" ON public.taxonomies
    FOR SELECT
    USING (true);

-- Function to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating the 'updated_at' column
DROP TRIGGER IF EXISTS update_taxonomies_modtime ON public.taxonomies;
CREATE TRIGGER update_taxonomies_modtime
    BEFORE UPDATE ON public.taxonomies
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Optional: Insert sample data for testing
-- INSERT INTO public.taxonomies (slug, name, type, description, seo_title, seo_description)
-- VALUES 
-- ('sublimacion', 'Sublimación', 'category', '<h1>Todo para sublimación</h1><p>Descarga las mejores plantillas.</p>', 'Plantillas para Sublimación Gratis | Diseños Gratis', 'Descarga cientos de plantillas gratis para sublimación, tazas, playeras y más.'),
-- ('dia-del-padre', 'Día del Padre', 'tag', '<h2>Diseños para el Día del Padre</h2><p>Vectores y plantillas editables.</p>', 'Vectores y Diseños para el Día del Padre | Diseños Gratis', 'Encuentra diseños creativos para celebrar a papá.');
