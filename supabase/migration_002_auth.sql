-- migration_002_auth.sql
-- Sistema de autenticación: user_id en cars + Row Level Security

-- 1. Añadir user_id a cars
ALTER TABLE cars ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Habilitar RLS en cars
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- 3. Políticas para cars
CREATE POLICY "Users can view their own cars"
  ON cars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cars"
  ON cars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cars"
  ON cars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cars"
  ON cars FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Habilitar RLS en maintenances
ALTER TABLE maintenances ENABLE ROW LEVEL SECURITY;

-- 5. Políticas para maintenances (aislamiento indirecto via car_id)
CREATE POLICY "Users can view maintenances of their cars"
  ON maintenances FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM cars WHERE cars.id = maintenances.car_id AND cars.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert maintenances on their cars"
  ON maintenances FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM cars WHERE cars.id = maintenances.car_id AND cars.user_id = auth.uid()
  ));

CREATE POLICY "Users can update maintenances of their cars"
  ON maintenances FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM cars WHERE cars.id = maintenances.car_id AND cars.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete maintenances of their cars"
  ON maintenances FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM cars WHERE cars.id = maintenances.car_id AND cars.user_id = auth.uid()
  ));
