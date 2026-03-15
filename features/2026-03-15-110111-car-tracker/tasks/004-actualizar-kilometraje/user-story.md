# Tarea 004: Actualizar Kilometraje

## Metadata
task_id: `004`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `RF-07`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 002 (crud coches) — actualizar km es un caso especial del edit
- 007 (indicadores) — el km actual afecta al cálculo de alertas

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| tabla `cars`.current_km | actualiza | 002 (también actualiza via edit) | NO (flujos distintos) |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 002
- **Bloquea a**: 007

## Historia de Usuario
**Como** usuario que ha conducido mi coche
**Quiero** poder actualizar el kilometraje actual rápidamente sin entrar al formulario de edición completo
**Para** mantener el odómetro al día y que las alertas por km sean precisas

## Criterios de Aceptación
- [ ] Desde la ficha del coche hay un botón/acción rápida para actualizar km
- [ ] Se muestra un input con el km actual como valor inicial
- [ ] Solo se puede introducir un valor mayor o igual al km actual
- [ ] El nuevo km se guarda en Supabase y se refleja inmediatamente en la UI

## Escenarios

### Escenario 1: Actualizar km correctamente
- **Dado** que el coche tiene 50.000 km registrados
- **Cuando** el usuario introduce 52.000 y confirma
- **Entonces** el coche muestra 52.000 km en su tarjeta y ficha

### Escenario 2: Intentar reducir el km
- **Dado** que el coche tiene 50.000 km
- **Cuando** el usuario introduce 48.000
- **Entonces** se muestra un error "El kilometraje no puede ser menor al actual"

## Notas
- Puede ser un modal rápido o un inline-edit en la ficha del coche
- No es necesario un formulario completo; un campo numérico con botón "Actualizar" es suficiente
- Esta acción es frecuente, debe ser accesible en 2 toques desde el dashboard
