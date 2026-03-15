# Tarea 001: Migración de Base de Datos

## Metadata
task_id: `001`
feature_id: `2026-03-15-121115-soporte-motos`
requisito: `N/A (fundacional)`
created_at: `2026-03-15T12:11:15Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
- car-tracker/001 (completada) — creó el schema original

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `supabase/schema.sql` | extiende | car-tracker/001 (completada) | NO |
| tabla `cars` | ALTER TABLE | — | NO |
| tabla `maintenances` | ALTER CONSTRAINT | — | NO |
| `src/utils/maintenanceTypes.js` | añade tipos moto | — | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: ninguna
- **Bloquea a**: 002, 003, 004

## Historia de Usuario
**Como** desarrollador
**Quiero** extender el schema de la BD y los tipos de mantenimiento para soportar motos
**Para** que todas las tareas siguientes puedan construirse sobre una base sólida

## Criterios de Aceptación
- [ ] Columna `vehicle_type` añadida a la tabla `cars` con DEFAULT 'car' y CHECK ('car', 'motorcycle')
- [ ] Constraint `maintenances_type_check` actualizado para incluir tipos de moto: `chain`, `air_filter`, `spark_plugs`, `brakes`, `brake_fluid`
- [ ] Columna `engine_cc` (INTEGER, nullable) añadida a la tabla `cars` para la cilindrada de motos
- [ ] `src/utils/maintenanceTypes.js` actualizado con los nuevos tipos de moto
- [ ] Los coches existentes en la BD no se ven afectados (DEFAULT 'car' retrocompatible)

## Escenarios

### Escenario 1: Migración exitosa
- **Dado** que la BD tiene coches existentes
- **Cuando** se ejecuta el SQL de migración
- **Entonces** todos los registros existentes tienen `vehicle_type = 'car'` y siguen funcionando

### Escenario 2: Nuevos tipos de mantenimiento disponibles
- **Dado** que se ha ejecutado la migración
- **Cuando** se registra un mantenimiento de tipo `chain`
- **Entonces** se guarda correctamente sin violar el CHECK constraint

## Notas
- El SQL de migración se ejecuta manualmente en el SQL Editor de Supabase (igual que el schema original)
- El archivo `supabase/schema.sql` se actualiza para documentar el estado final del schema
- `maintenanceTypes.js` es un cambio de código (no requiere SQL)
