-- Migración 001: Soporte para Motos
-- Ejecutar en: Supabase Dashboard → SQL Editor

-- 1. Añadir vehicle_type a cars (DEFAULT 'car' para retrocompatibilidad)
ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS vehicle_type TEXT NOT NULL DEFAULT 'car'
    CHECK (vehicle_type IN ('car', 'motorcycle'));

-- 2. Añadir cilindrada opcional a cars
ALTER TABLE cars
  ADD COLUMN IF NOT EXISTS engine_cc INTEGER;

-- 3. Ampliar tipos de mantenimiento para incluir tipos de moto
ALTER TABLE maintenances DROP CONSTRAINT IF EXISTS maintenances_type_check;
ALTER TABLE maintenances
  ADD CONSTRAINT maintenances_type_check
    CHECK (type IN (
      'oil', 'tires', 'itv', 'revision',
      'chain', 'air_filter', 'spark_plugs', 'brakes', 'brake_fluid',
      'custom'
    ));
