# Tarea 007: Indicadores de Estado y Alertas

## Metadata
task_id: `007`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `RF-03, RF-06`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 003 (dashboard) — añade el indicador visual a las tarjetas
- 004 (km) — el km actual alimenta el cálculo
- 005 (mantenimientos) — lee `next_date` y `next_km`
- 006 (historial) — reutiliza componentes de lista

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| CarCard component | extiende (añade badge) | 003 (lo creó) | NO |
| utils/alertLogic.js | crea | — | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 004, 005, 006
- **Bloquea a**: 008

## Historia de Usuario
**Como** usuario que quiere saber el estado de sus coches de un vistazo
**Quiero** ver un indicador de color en cada tarjeta y alertas claras cuando una revisión está próxima o vencida
**Para** actuar a tiempo sin tener que revisar el historial completo

## Criterios de Aceptación
- [ ] Cada tarjeta de coche muestra un badge de color: verde (todo OK), amarillo (revisión próxima), rojo (revisión vencida)
- [ ] Amarillo: quedan menos de 1.000 km para un `next_km`, o menos de 30 días para un `next_date`
- [ ] Rojo: el `current_km` supera algún `next_km`, o la fecha actual supera algún `next_date`
- [ ] La ficha del coche muestra la lista de revisiones próximas pendientes ordenadas por urgencia
- [ ] El color del badge refleja el peor estado entre todos los mantenimientos del coche

## Escenarios

### Escenario 1: Coche en buen estado
- **Dado** que todos los `next_km` y `next_date` del coche están lejos
- **Cuando** el usuario ve el dashboard
- **Entonces** la tarjeta muestra badge verde

### Escenario 2: Revisión próxima (amarillo)
- **Dado** que el coche está a 800 km del próximo cambio de aceite
- **Cuando** el usuario ve el dashboard
- **Entonces** la tarjeta muestra badge amarillo

### Escenario 3: Revisión vencida (rojo)
- **Dado** que la fecha de ITV pasó hace 5 días
- **Cuando** el usuario ve el dashboard
- **Entonces** la tarjeta muestra badge rojo con texto "Revisión vencida"

### Escenario 4: Coche sin mantenimientos con próxima revisión
- **Dado** que el coche no tiene ningún `next_km` ni `next_date` definido
- **Cuando** el usuario ve el dashboard
- **Entonces** la tarjeta muestra badge verde (sin datos = sin alerta)

## Notas
- La lógica de cálculo del estado debe estar en una función pura (`getCarStatus(car, maintenances)`) para facilitar testing
- Prioridad visual: rojo > amarillo > verde
- Los umbrales (1.000 km, 30 días) deben estar como constantes para fácil ajuste
- Esta tarea es el elemento más impactante para el jurado según el PRD — cuidar el diseño del badge
