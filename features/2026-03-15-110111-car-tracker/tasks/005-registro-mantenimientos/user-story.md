# Tarea 005: Registro de Mantenimientos

## Metadata
task_id: `005`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `RF-04, RF-08`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
- 002 (crud coches) — un mantenimiento pertenece a un coche
- 006 (historial) — consume los mantenimientos creados aquí
- 007 (alertas) — lee `next_date` y `next_km` de los mantenimientos

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| tabla `maintenances` | crea/modifica/elimina | 006, 007 (solo lectura) | NO |
| MaintenanceForm component | crea | — | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 002
- **Bloquea a**: 006, 007

## Historia de Usuario
**Como** usuario que acaba de hacer una revisión a mi coche
**Quiero** registrar el mantenimiento con el tipo, fecha, km y próxima revisión prevista
**Para** tener el historial actualizado y recibir alertas cuando toque la siguiente

## Criterios de Aceptación
- [ ] Formulario con campos: tipo (oil/tires/itv/revision/custom), fecha realizada, km en que se hizo, próxima fecha (opcional), próximos km (opcional), notas (opcional)
- [ ] Para tipo "custom" se habilita un campo de texto libre para el nombre
- [ ] El mantenimiento se guarda asociado al coche correcto en Supabase
- [ ] El usuario puede editar un mantenimiento existente
- [ ] El usuario puede eliminar un mantenimiento (con confirmación)

## Escenarios

### Escenario 1: Registrar cambio de aceite
- **Dado** que el usuario está en la ficha de su coche
- **Cuando** pulsa "Añadir mantenimiento", selecciona "Aceite", introduce fecha y km, y fija el próximo a 60.000 km
- **Entonces** el mantenimiento se guarda y aparece en el historial del coche

### Escenario 2: Registrar mantenimiento personalizado
- **Dado** que el usuario quiere registrar "Cambio de pastillas de freno"
- **Cuando** selecciona tipo "Custom" e introduce el nombre
- **Entonces** se guarda con la etiqueta personalizada visible en el historial

### Escenario 3: Guardar sin próxima revisión
- **Dado** que el usuario no sabe cuándo toca la próxima
- **Cuando** deja vacíos `next_date` y `next_km`
- **Entonces** el mantenimiento se guarda igualmente sin generar alerta

## Notas
- Los tipos predefinidos tienen iconos/colores distintos para identificación visual rápida
- `next_date` y `next_km` son opcionales; la alerta solo se activa si al menos uno está relleno
- El campo `label` se usa solo cuando `type = custom`; para el resto se auto-rellena con el nombre del tipo
