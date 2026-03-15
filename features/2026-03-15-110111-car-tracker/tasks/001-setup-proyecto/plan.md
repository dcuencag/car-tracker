# Plan: Setup del Proyecto

## Metadata
task_path: `features/2026-03-15-110111-car-tracker/tasks/001-setup-proyecto`
feature_id: `2026-03-15-110111-car-tracker`
created_at: `2026-03-15T11:01:11Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
- Repositorio revisado: solo contiene `prd.md`, `.gitignore` y carpeta `features/`
- No existe ningún proyecto frontend, package.json ni configuración previa
- No hay CLAUDE.md con convenciones — se siguen las del PRD

### Matriz de Impacto

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| Proyecto Vite + React | — | — | CREAR |
| Tailwind config | — | — | CREAR |
| Supabase client | — | — | CREAR |
| Variables de entorno | — | — | CREAR |
| Estructura de carpetas | — | — | CREAR |
| SQL schema Supabase | — | — | CREAR |

**Archivos Nuevos Requeridos**: ~12
**Archivos a Modificar**: 0

### Evaluación de Patrones
- Proyecto nuevo desde cero: no hay patrones previos que seguir
- Se usará la estructura estándar de Vite React: `src/components/`, `src/pages/`, `src/lib/`
- Convención de nombres: PascalCase para componentes React, camelCase para utils

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| — | — | — | Sin conflictos |

**Conflictos Encontrados**: 0

## Resumen
Crear el proyecto React + Vite + Tailwind desde cero, configurar el cliente Supabase con variables de entorno, y crear las tablas `cars` y `maintenances` en Supabase con el esquema definido en el PRD. El resultado es un proyecto arrancando en local con conexión funcional a la base de datos.

## Historia de Usuario
**Como** desarrollador del proyecto
**Quiero** tener el entorno de desarrollo configurado con React, Vite, Tailwind y Supabase
**Para** poder construir todas las funcionalidades del car tracker sobre una base sólida

## Archivos a Crear
- `src/main.jsx` — punto de entrada de React
- `src/App.jsx` — componente raíz con router básico
- `src/index.css` — estilos globales con directivas Tailwind
- `src/lib/supabase.js` — cliente Supabase singleton
- `src/components/.gitkeep` — placeholder estructura componentes
- `src/pages/.gitkeep` — placeholder estructura páginas
- `vite.config.js` — configuración de Vite
- `tailwind.config.js` — configuración de Tailwind
- `postcss.config.js` — configuración PostCSS para Tailwind
- `index.html` — HTML raíz de Vite
- `.env.local` — variables de entorno (no se versiona)
- `.env.example` — plantilla de variables (sí se versiona)
- `supabase/schema.sql` — SQL para crear las tablas en Supabase

## Plan de Implementación

### Fase 1: Scaffolding del proyecto
Crear el proyecto Vite con template React y instalar dependencias.

### Fase 2: Configurar Tailwind CSS
Integrar Tailwind en el pipeline de Vite.

### Fase 3: Configurar Supabase
Crear el cliente Supabase y definir el schema SQL de las tablas.

### Fase 4: Estructura de carpetas
Establecer la organización de `src/` para las tareas siguientes.

## Pasos de Implementación

### 1. Crear proyecto Vite + React
```bash
npm create vite@latest . -- --template react
npm install
```
- Esto genera `package.json`, `vite.config.js`, `src/main.jsx`, `src/App.jsx`, `index.html`
- Confirmar con `y` si pregunta si sobrescribir el directorio

### 2. Instalar dependencias
```bash
npm install @supabase/supabase-js react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
- `@supabase/supabase-js` — cliente oficial de Supabase
- `react-router-dom` — navegación entre páginas
- `tailwindcss`, `postcss`, `autoprefixer` — estilos

### 3. Configurar Tailwind
Editar `tailwind.config.js` para incluir los paths de los archivos JSX:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Reemplazar el contenido de `src/index.css` con las directivas de Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Crear cliente Supabase
Crear `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 5. Configurar variables de entorno
Crear `.env.example`:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-publica
```

Crear `.env.local` con las credenciales reales del proyecto Supabase (no versionar).

Verificar que `.gitignore` incluye `.env.local` (ya debería estar incluido por Vite).

### 6. Crear schema SQL para Supabase
Crear `supabase/schema.sql` con el DDL completo:
```sql
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
```

Ejecutar este SQL en el SQL Editor de Supabase (Dashboard → SQL Editor).

Para el hackathon, deshabilitar RLS (Row Level Security) en ambas tablas para simplificar:
```sql
ALTER TABLE cars DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenances DISABLE ROW LEVEL SECURITY;
```

### 7. Limpiar App.jsx y crear estructura de carpetas
Reemplazar el contenido de `src/App.jsx` con un componente mínimo que confirme que Tailwind y Supabase funcionan:
```jsx
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800">Car Tracker 🚗</h1>
    </div>
  )
}

export default App
```

Crear carpetas vacías con `.gitkeep`:
- `src/components/`
- `src/pages/`
- `src/lib/` (ya tiene `supabase.js`)

### 8. Verificar que todo funciona
```bash
npm run dev
```
- La app debe arrancar en `http://localhost:5173`
- Debe mostrar el texto "Car Tracker" con fondo gris (Tailwind aplicado)
- Abrir la consola del navegador: no debe haber errores de Supabase

## Criterios de Aceptación
- [ ] Proyecto Vite + React creado y arrancando en local (`npm run dev`)
- [ ] Tailwind CSS configurado y aplicando estilos correctamente
- [ ] Cliente de Supabase configurado con variables de entorno
- [ ] Tablas `cars` y `maintenances` creadas en Supabase con el esquema del PRD
- [ ] Estructura de carpetas del proyecto definida (`/components`, `/pages`, `/lib`)

## Comandos de Validación

```bash
# Verificar que el proyecto arranca
npm run dev &
sleep 3
curl -s http://localhost:5173 | grep -q "Car Tracker" && echo "✓ App arrancando" || echo "✗ App no responde"
kill %1

# Verificar dependencias instaladas
node -e "require('./node_modules/@supabase/supabase-js')" && echo "✓ Supabase instalado"
node -e "require('./node_modules/react-router-dom')" && echo "✓ React Router instalado"

# Verificar estructura de carpetas
test -d src/components && echo "✓ src/components existe"
test -d src/pages && echo "✓ src/pages existe"
test -d src/lib && echo "✓ src/lib existe"
test -f src/lib/supabase.js && echo "✓ supabase.js existe"
test -f supabase/schema.sql && echo "✓ schema.sql existe"
test -f .env.example && echo "✓ .env.example existe"

# Verificar que .env.local NO está versionado
git ls-files .env.local | grep -q ".env.local" && echo "✗ ALERTA: .env.local está versionado" || echo "✓ .env.local no versionado"
```

## Notas
- Las credenciales de Supabase se obtienen en: Dashboard → Settings → API
- `VITE_SUPABASE_URL` es la "Project URL"
- `VITE_SUPABASE_ANON_KEY` es la "anon public" key (es pública, puede ir en el frontend)
- RLS desactivado es aceptable para un hackathon; en producción se habilitaría con políticas por usuario
- El schema SQL se guarda en `supabase/schema.sql` para documentación, pero se ejecuta manualmente en el dashboard de Supabase
