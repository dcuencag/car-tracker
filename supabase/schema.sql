-- Car Tracker - Schema SQL
-- Ejecutar en: Supabase Dashboard → SQL Editor

-- Tabla de coches
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  plate TEXT,
  photo_url TEXT,
  current_km INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de mantenimientos
CREATE TABLE IF NOT EXISTS maintenances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('oil', 'tires', 'itv', 'revision', 'custom')),
  label TEXT,
  done_at DATE,
  done_km INTEGER,
  next_date DATE,
  next_km INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para queries por car_id
CREATE INDEX IF NOT EXISTS idx_maintenances_car_id ON maintenances(car_id);

-- Deshabilitar RLS para el hackathon (acceso público)
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenances DISABLE ROW LEVEL SECURITY;
