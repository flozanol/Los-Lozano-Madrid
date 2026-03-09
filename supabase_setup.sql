-- ==========================================
-- SUPABASE DASHBOARD -> SQL EDITOR
-- Copia y pega todo este código y dale a "Run"
-- ==========================================

-- 0. Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Rankings (Para la sección de Ranking Lozano)
CREATE TABLE IF NOT EXISTS rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- 'Tapas', 'Bares', 'Cafés', 'Experiencias'
  item_name TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar algunos ejemplos iniciales para el Ranking
INSERT INTO rankings (category, item_name, votes) VALUES 
('Tapas', 'Tortilla de Patatas', 0),
('Tapas', 'Croquetas de Jamón', 0),
('Bares', 'La Cava Baja', 0),
('Experiencias', 'Paseo por el Retiro', 0);

-- 2. Diario (Para la sección Diario del Viaje)
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date_str TEXT NOT NULL, -- Ej: '26 MAR'
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Misiones (Para la sección Misiones del Viaje)
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task TEXT NOT NULL,
  description TEXT, -- Nueva columna para detalles
  completed BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- snippet para actualizar si ya existe
DO $$ 
BEGIN 
  BEGIN
    ALTER TABLE missions ADD COLUMN description TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;

-- Insertar misiones iniciales
INSERT INTO missions (task, points) VALUES 
('Probar 5 tipos de tapas distintas', 20),
('Visitar 3 barrios diferentes', 15),
('Hacerse una foto familiar en la Plaza Mayor', 10),
('Encontrar un "Secreto" de Madrid', 25),
('Tomar un chocolate con churros', 10);

-- 4. Barrios (Para la sección Barrios de Madrid)
CREATE TABLE IF NOT EXISTS barrios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  vibe TEXT,
  description TEXT,
  image_url TEXT,
  what_to_do TEXT[], -- Array de textos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Rincon del Gato (Restaurantes Locales)
CREATE TABLE IF NOT EXISTS local_restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  area TEXT,
  specialty TEXT,
  description TEXT,
  vibe TEXT,
  price TEXT, -- €, €€, €€€
  image_url TEXT,
  map_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS y políticas para local_restaurants
ALTER TABLE local_restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for local_restaurants"
  ON local_restaurants FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert for local_restaurants"
  ON local_restaurants FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update for local_restaurants"
  ON local_restaurants FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete for local_restaurants"
  ON local_restaurants FOR DELETE
  TO public
  USING (true);

-- 6. Rutas Caminables
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  distance TEXT,
  time_est TEXT,
  description TEXT,
  stops TEXT[],
  image_url TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- snippet para actualizar rutas si ya existe
DO $$ 
BEGIN 
  BEGIN
    ALTER TABLE routes ADD COLUMN google_maps_url TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;


-- 7. Actualizar tabla Itinerary (Campos adicionales)
DO $$ 
BEGIN 
  BEGIN
    ALTER TABLE itinerary ADD COLUMN meeting_point TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;
  
  BEGIN
    ALTER TABLE itinerary ADD COLUMN plan_b TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;

  BEGIN
    ALTER TABLE itinerary ADD COLUMN accessibility_notes TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;

  BEGIN
    ALTER TABLE itinerary ADD COLUMN reservation_details TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;

  BEGIN
    ALTER TABLE itinerary ADD COLUMN time_block TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;
  
  BEGIN
    ALTER TABLE itinerary ADD COLUMN transit_time TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;

  BEGIN
    ALTER TABLE itinerary ADD COLUMN image_url TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;

  BEGIN
    ALTER TABLE itinerary ADD COLUMN confirmed_participants TEXT;
  EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;
