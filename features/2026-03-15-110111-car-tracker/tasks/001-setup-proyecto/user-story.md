# Tarea 001: Setup del Proyecto

## Metadata
task_id: `001`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `N/A (fundacional)`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
- Ninguna (es la tarea base del proyecto)

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| package.json | crea | — | NO |
| vite.config.js | crea | — | NO |
| supabase schema | crea | — | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: ninguna
- **Bloquea a**: 002, 003, 004, 005, 006, 007, 008

## Historia de Usuario
**Como** desarrollador del proyecto
**Quiero** tener el entorno de desarrollo configurado con React, Vite, Tailwind y Supabase
**Para** poder construir todas las funcionalidades del car tracker sobre una base sólida

## Criterios de Aceptación
- [ ] Proyecto Vite + React creado y arrancando en local (`npm run dev`)
- [ ] Tailwind CSS configurado y aplicando estilos correctamente
- [ ] Cliente de Supabase configurado con variables de entorno
- [ ] Tablas `cars` y `maintenances` creadas en Supabase con el esquema del PRD
- [ ] Estructura de carpetas del proyecto definida (`/components`, `/pages`, `/lib`)

## Escenarios

### Escenario 1: Setup completo exitoso
- **Dado** un repositorio vacío
- **Cuando** se ejecuta `npm run dev`
- **Entonces** la app arranca en localhost sin errores y muestra una pantalla inicial

### Escenario 2: Conexión con Supabase
- **Dado** el cliente Supabase configurado con las credenciales
- **Cuando** se hace una query de prueba a la tabla `cars`
- **Entonces** devuelve una respuesta vacía sin errores de conexión

## Notas
- Usar `@supabase/supabase-js` para el cliente
- Variables de entorno en `.env.local`: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- RLS (Row Level Security) en Supabase: desactivar para el hackathon o usar política pública de lectura/escritura
- Incluir en el schema los índices necesarios: `car_id` en `maintenances`
