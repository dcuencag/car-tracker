# Plan: Registro y Gestión de Coches

## Metadata
task_path: `features/2026-03-15-110111-car-tracker/tasks/002-crud-coches`
feature_id: `2026-03-15-110111-car-tracker`
created_at: `2026-03-15T11:01:11Z`
status: `planned`

## Análisis de Código Existente

### Búsqueda Realizada
- `src/App.jsx` — componente raíz mínimo, sin router aún
- `src/main.jsx` — punto de entrada estándar de Vite
- `src/lib/supabase.js` — cliente Supabase listo
- `src/components/` y `src/pages/` — carpetas vacías
- No hay hooks, no hay componentes, no hay páginas

### Matriz de Impacto

| Componente | Archivo Existente | Líneas | Impacto |
|------------|-------------------|--------|---------|
| App (router) | `src/App.jsx` | 1-11 | MODIFICAR |
| Supabase client | `src/lib/supabase.js` | 1-6 | REUTILIZAR |
| Hook useCars | — | — | CREAR |
| CarForm component | — | — | CREAR |
| ConfirmDialog component | — | — | CREAR |
| CarFormPage | — | — | CREAR |
| CarDetailPage | — | — | CREAR |

**Archivos Nuevos Requeridos**: 5
**Archivos a Modificar**: 1 (App.jsx)

### Evaluación de Patrones
- React Router v7 instalado — usar `<BrowserRouter>` + `<Routes>` + `<Route>`
- Supabase client importado desde `src/lib/supabase.js`
- Tailwind para todos los estilos (sin CSS modules ni styled-components)
- Lógica de datos en hooks (`src/hooks/`) para separar de la UI
- PascalCase para componentes y páginas, camelCase para hooks y utils

### Matriz de Conflictos

| Tipo | Recurso | Otra Tarea | Resolución |
|------|---------|------------|------------|
| Archivo | `src/App.jsx` | 003 (añadirá ruta dashboard) | 003 añade su ruta, no reemplaza |

**Conflictos Encontrados**: 0

## Resumen
Implementar el CRUD completo de coches: hook `useCars` con operaciones Supabase, formulario compartido `CarForm` para crear y editar, página `CarFormPage` (nueva y edición), página `CarDetailPage` con botón de eliminar. Se configura React Router en `App.jsx` con las rutas necesarias. La tarea 003 añadirá después la ruta `/` del dashboard.

## Historia de Usuario
**Como** usuario con un vehículo
**Quiero** poder añadir, editar y eliminar mis coches con sus datos básicos
**Para** tener un registro de todos mis vehículos en la aplicación

## Archivos a Modificar
- `src/App.jsx` — añadir BrowserRouter y rutas para `/cars/new`, `/cars/:id`, `/cars/:id/edit`

## Archivos a Crear
- `src/hooks/useCars.js` — operaciones CRUD contra Supabase (fetch, create, update, delete)
- `src/components/CarForm.jsx` — formulario compartido para crear y editar coches
- `src/components/ConfirmDialog.jsx` — diálogo de confirmación reutilizable para delete
- `src/pages/CarFormPage.jsx` — página de crear/editar coche (usa CarForm)
- `src/pages/CarDetailPage.jsx` — ficha del coche con botones editar/eliminar

## Plan de Implementación

### Fase 1: Capa de datos
Hook `useCars` con todas las operaciones Supabase.

### Fase 2: Componentes UI
`CarForm` con validación y `ConfirmDialog`.

### Fase 3: Páginas y routing
`CarFormPage`, `CarDetailPage` y configuración del router en `App.jsx`.

## Pasos de Implementación

### 1. Crear hook `useCars`
Archivo: `src/hooks/useCars.js`

Exportar funciones puras (no hooks con estado) para las operaciones:
```js
import { supabase } from '../lib/supabase'

export async function getCars() {
  const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCarById(id) {
  const { data, error } = await supabase.from('cars').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function createCar(car) {
  const { data, error } = await supabase.from('cars').insert([car]).select().single()
  if (error) throw error
  return data
}

export async function updateCar(id, car) {
  const { data, error } = await supabase.from('cars').update(car).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCar(id) {
  const { error } = await supabase.from('cars').delete().eq('id', id)
  if (error) throw error
}
```

### 2. Crear componente `ConfirmDialog`
Archivo: `src/components/ConfirmDialog.jsx`

Modal simple con botones "Cancelar" y "Eliminar":
```jsx
export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-gray-600 border rounded-lg">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 3. Crear componente `CarForm`
Archivo: `src/components/CarForm.jsx`

Formulario controlado con validación. Props: `initialData` (para edición), `onSubmit`, `onCancel`, `loading`.

Campos:
- `brand` (texto, obligatorio)
- `model` (texto, obligatorio)
- `year` (número, opcional)
- `plate` (texto, opcional)
- `photo_url` (texto URL, opcional)
- `current_km` (número, obligatorio, min 0)

Validación: si `brand`, `model` o `current_km` están vacíos, mostrar error debajo del campo y no enviar.

Estado local con `useState` para los valores del formulario y los errores.

### 4. Crear página `CarFormPage`
Archivo: `src/pages/CarFormPage.jsx`

- Lee el param `:id` de la URL con `useParams`
- Si hay `id` → modo edición: carga el coche con `getCarById(id)` en `useEffect`
- Si no hay `id` → modo creación: formulario vacío
- Al enviar: llama `createCar` o `updateCar` y redirige a `/` con `useNavigate`
- Muestra spinner mientras carga el coche en edición

### 5. Crear página `CarDetailPage`
Archivo: `src/pages/CarDetailPage.jsx`

- Carga el coche con `getCarById(id)` usando `useParams`
- Muestra los datos del coche (foto, marca, modelo, año, matrícula, km)
- Botón "Editar" → navega a `/cars/:id/edit`
- Botón "Eliminar" → abre `ConfirmDialog`; si confirma, llama `deleteCar(id)` y redirige a `/`
- Botón "← Volver" para ir al dashboard

### 6. Actualizar `App.jsx` con el router
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CarFormPage from './pages/CarFormPage'
import CarDetailPage from './pages/CarDetailPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cars/new" replace />} />
        <Route path="/cars/new" element={<CarFormPage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/cars/:id/edit" element={<CarFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

Nota: la ruta `/` redirige a `/cars/new` temporalmente. La tarea 003 la reemplazará con el Dashboard.

### 7. Validación: build limpio
```bash
npm run build
```
Debe compilar sin errores.

## Criterios de Aceptación
- [ ] Formulario para añadir coche con campos: marca, modelo, año, matrícula, foto (URL), km actuales
- [ ] El coche se guarda en Supabase y aparece disponible inmediatamente
- [ ] El usuario puede editar cualquier campo de un coche existente
- [ ] El usuario puede eliminar un coche (con confirmación)
- [ ] Validación básica: marca, modelo y km son obligatorios

## Comandos de Validación

```bash
# Build limpio
npm run build

# Verificar archivos creados
test -f src/hooks/useCars.js && echo "✓ useCars.js"
test -f src/components/CarForm.jsx && echo "✓ CarForm.jsx"
test -f src/components/ConfirmDialog.jsx && echo "✓ ConfirmDialog.jsx"
test -f src/pages/CarFormPage.jsx && echo "✓ CarFormPage.jsx"
test -f src/pages/CarDetailPage.jsx && echo "✓ CarDetailPage.jsx"
```

## Notas
- El CASCADE en Supabase ya está definido en el schema: al eliminar un coche se eliminan sus mantenimientos automáticamente
- No usar `alert()` nativo para la confirmación — usar el componente `ConfirmDialog`
- La ruta `/` queda como redirect temporal a `/cars/new`; la tarea 003 la reemplazará con `<DashboardPage />`
- React Router v7 usa la misma API de componentes que v6 (`BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`)
