# Tarea 004: Tipos de Mantenimiento para Motos

## Metadata
task_id: `004`
feature_id: `2026-03-15-121115-soporte-motos`
requisito: `RF-04, RF-05`
created_at: `2026-03-15T12:11:15Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 001 (migración BD) — amplía el CHECK constraint de maintenances
- car-tracker/005 (completada) — creó MaintenanceForm que se extiende
- car-tracker/007 (completada) — usa maintenanceTypes.js para alertas (sin cambios)

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `src/utils/maintenanceTypes.js` | añade tipos moto | car-tracker/007 (completada) | NO (solo añade) |
| `src/components/MaintenanceForm.jsx` | filtra tipos según vehículo | car-tracker/005 (completada) | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 001
- **Bloquea a**: ninguna

## Historia de Usuario
**Como** usuario con una moto
**Quiero** poder registrar mantenimientos específicos de moto (cadena, bujías, filtro de aire...)
**Para** llevar un historial completo adaptado a las necesidades reales de mi moto

## Criterios de Aceptación
- [ ] El formulario de mantenimiento muestra tipos distintos según si el vehículo es coche o moto
- [ ] Para motos: cadena 🔗, filtro de aire 💨, bujías ⚡, frenos 🛑, líquido de frenos, custom
- [ ] Para coches: los tipos originales (aceite, neumáticos, ITV, revisión, custom)
- [ ] Los tipos de moto tienen iconos y colores diferenciados
- [ ] El historial muestra correctamente el icono y label del tipo de moto

## Escenarios

### Escenario 1: Registrar mantenimiento de cadena
- **Dado** que el usuario está en la ficha de su moto y pulsa "Añadir mantenimiento"
- **Cuando** ve el formulario
- **Entonces** ve los tipos de moto (cadena, bujías, etc.) y NO ve ITV ni neumáticos de coche

### Escenario 2: Historial con tipo de moto
- **Dado** que la moto tiene un mantenimiento de tipo `chain` registrado
- **Cuando** el usuario ve el historial
- **Entonces** ve el icono 🔗 y la etiqueta "Cadena" correctamente

### Escenario 3: Coches no afectados
- **Dado** que el usuario tiene un coche con mantenimientos registrados
- **Cuando** añade un mantenimiento al coche
- **Entonces** ve los tipos originales (aceite, neumáticos, ITV...) sin cambios

## Notas
- `MaintenanceForm` recibe una prop `vehicleType` para filtrar los tipos mostrados
- `MaintenanceFormPage` lee el `vehicle_type` del coche/moto y lo pasa al formulario
- La lógica de alertas en `alertLogic.js` no necesita cambios (opera sobre next_km/next_date independientemente del tipo)
- Tipos de moto a añadir en `maintenanceTypes.js`:
  - `chain`: Cadena 🔗
  - `air_filter`: Filtro de aire 💨
  - `spark_plugs`: Bujías ⚡
  - `brakes`: Frenos 🛑
  - `brake_fluid`: Líquido de frenos 🔵
