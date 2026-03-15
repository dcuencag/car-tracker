# Tarea 002: CRUD de Motos

## Metadata
task_id: `002`
feature_id: `2026-03-15-121115-soporte-motos`
requisito: `RF-01, RF-06, RF-07`
created_at: `2026-03-15T12:11:15Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
- 001 (migración BD) — debe estar completa
- car-tracker/002 (completada) — creó CarForm y CarFormPage que se modifican aquí

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `src/components/CarForm.jsx` | modifica (añade vehicle_type, engine_cc, oculta ITV) | car-tracker/002 (completada) | NO |
| `src/pages/CarFormPage.jsx` | modifica (pasa vehicleType por param/query) | car-tracker/002 (completada) | NO |
| `src/hooks/useCars.js` | sin cambios | — | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 001
- **Bloquea a**: 003

## Historia de Usuario
**Como** usuario con una moto
**Quiero** poder registrar, editar y eliminar mi moto con sus datos específicos
**Para** llevar el control de su mantenimiento igual que con mi coche

## Criterios de Aceptación
- [ ] El formulario de nueva moto no muestra el campo ITV y sí muestra el campo cilindrada (opcional)
- [ ] La moto se guarda con `vehicle_type = 'motorcycle'` en Supabase
- [ ] El usuario puede editar todos los campos de una moto existente
- [ ] El usuario puede eliminar una moto (con confirmación)
- [ ] Las rutas `/motorcycles/new` y `/motorcycles/:id/edit` llevan al formulario de moto

## Escenarios

### Escenario 1: Añadir moto correctamente
- **Dado** que el usuario pulsa "Añadir moto" en el dashboard
- **Cuando** rellena marca, modelo y km y pulsa "Guardar"
- **Entonces** la moto se guarda con `vehicle_type = 'motorcycle'` y aparece en la pestaña Motos

### Escenario 2: Formulario adaptado
- **Dado** que el usuario abre el formulario de nueva moto
- **Cuando** ve los campos disponibles
- **Entonces** ve el campo "Cilindrada (cc)" pero NO ve el campo ITV

### Escenario 3: Eliminar moto
- **Dado** que el usuario está en la ficha de su moto
- **Cuando** pulsa "Eliminar" y confirma
- **Entonces** la moto y sus mantenimientos se borran y desaparece del dashboard

## Notas
- Reutilizar `CarForm` parametrizándolo con `vehicleType` prop en lugar de duplicarlo
- El campo ITV se oculta condicionalmente cuando `vehicleType === 'motorcycle'`
- Las rutas pueden ser `/motorcycles/new` y `/motorcycles/:id` o bien usar query params `?type=motorcycle`
- `CarDetailPage` se reutiliza tal cual (muestra los datos del vehículo independientemente del tipo)
