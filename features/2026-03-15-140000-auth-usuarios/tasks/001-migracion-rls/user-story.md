# Tarea 001: Migración de BD — user_id y Row Level Security

## Metadata
task_id: `001`
feature_id: `2026-03-15-140000-auth-usuarios`
requisito: `RF-02, RF-07`
created_at: `2026-03-15T14:00:00Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
- soporte-motos/001-migracion-bd (completada) — añadió vehicle_type y engine_cc a cars

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `supabase/` (SQL) | Crear migration_002 | soporte-motos/001 (completada) | NO |
| Tabla `cars` | Añadir user_id | soporte-motos/001 (completada) | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: ninguna
- **Bloquea a**: 004-integracion-usuario

## Historia de Usuario
**Como** desarrollador
**Quiero** añadir `user_id` a la tabla `cars` y activar Row Level Security
**Para** que cada usuario solo pueda ver y modificar sus propios vehículos

## Criterios de Aceptación
- [ ] La tabla `cars` tiene columna `user_id UUID` referenciando `auth.users`
- [ ] RLS está habilitado en la tabla `cars`
- [ ] Política SELECT: el usuario solo ve sus propios coches
- [ ] Política INSERT: el usuario solo puede insertar coches con su `user_id`
- [ ] Política UPDATE/DELETE: el usuario solo puede modificar/borrar sus coches

## Escenarios

### Escenario 1: Usuario autenticado consulta sus coches
- **Dado** que hay coches de dos usuarios diferentes en la tabla
- **Cuando** el usuario A ejecuta `SELECT * FROM cars`
- **Entonces** solo ve los coches con su `user_id`

### Escenario 2: Usuario intenta modificar coche ajeno
- **Dado** que el usuario A intenta actualizar un coche del usuario B
- **Cuando** ejecuta `UPDATE cars SET ... WHERE id = coche_de_B`
- **Entonces** Supabase devuelve 0 rows affected (RLS bloquea silenciosamente)

## Notas
- Crear `supabase/migration_002_auth.sql` con los cambios
- El script debe ejecutarse manualmente en el SQL Editor de Supabase
- Los registros existentes en `cars` sin `user_id` quedarán con NULL; aceptable para hackathon
- `maintenances` no necesita `user_id` porque ya está protegida indirectamente a través de `car_id` — si el usuario no puede ver el coche, tampoco puede ver sus mantenimientos. Se añade RLS en maintenances igualmente por seguridad.
