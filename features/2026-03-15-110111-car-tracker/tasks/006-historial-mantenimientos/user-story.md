# Tarea 006: Historial de Mantenimientos

## Metadata
task_id: `006`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `RF-05`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 005 (registro mantenimientos) — fuente de datos
- 007 (indicadores y alertas) — comparte la visualización de mantenimientos pendientes

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| tabla `maintenances` | solo lectura | 005 (escritura) | NO |
| MaintenanceList component | crea | 007 (extiende/reutiliza) | REVISAR |

**Conflictos Encontrados**: 0 (007 usa el componente, no lo reemplaza)

### Dependencias
- **Requiere completar antes**: 005
- **Bloquea a**: 007, 008

## Historia de Usuario
**Como** usuario con varios mantenimientos registrados
**Quiero** ver el historial completo de revisiones de cada coche ordenado por fecha
**Para** saber exactamente qué se ha hecho y cuándo, sin tener que recordarlo de memoria

## Criterios de Aceptación
- [ ] La ficha del coche muestra la lista de todos sus mantenimientos ordenados por fecha (más reciente primero)
- [ ] Cada entrada muestra: tipo (con icono), fecha realizada, km realizados, y próxima revisión si existe
- [ ] Si no hay mantenimientos, se muestra un mensaje invitando a registrar el primero
- [ ] Cada entrada tiene acciones rápidas para editar o eliminar
- [ ] El historial diferencia visualmente entre mantenimientos pasados y próximas revisiones pendientes

## Escenarios

### Escenario 1: Ver historial con varios mantenimientos
- **Dado** que un coche tiene 3 mantenimientos registrados
- **Cuando** el usuario abre la ficha del coche
- **Entonces** ve los 3 mantenimientos ordenados del más reciente al más antiguo, con tipo, fecha y km

### Escenario 2: Historial vacío
- **Dado** que el coche no tiene ningún mantenimiento registrado
- **Cuando** el usuario abre la ficha del coche
- **Entonces** ve un mensaje "Aún no hay mantenimientos registrados" y un botón para añadir el primero

### Escenario 3: Editar desde el historial
- **Dado** que el usuario ve el historial
- **Cuando** pulsa editar en una entrada
- **Entonces** se abre el formulario de edición del mantenimiento pre-rellenado con sus datos

## Notas
- Separar visualmente la sección "Historial" (pasado) de "Próximas revisiones" (futuro)
- El historial puede ser largo; considerar scroll sin paginación para el hackathon
- Los iconos por tipo de mantenimiento (aceite=gota, neumáticos=círculo, ITV=documento...) mejoran la legibilidad
