-- migration_004_cost.sql
-- Añadir campo de coste a los mantenimientos
ALTER TABLE maintenances ADD COLUMN IF NOT EXISTS cost NUMERIC(10,2);
