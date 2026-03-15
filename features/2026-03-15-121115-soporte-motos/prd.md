# Soporte para Motos

## Metadata
feature_id: `2026-03-15-121115-soporte-motos`
created_at: `2026-03-15T12:11:15Z`
status: `prd_created`

---

## Análisis de PRDs Existentes

### PRDs Revisados
- `prd.md` (raíz) — Car Tracker original: coches con CRUD, mantenimientos, alertas

### Matriz de Solapamiento

| Aspecto | Este PRD | PRD Existente | Conflicto? |
|---------|----------|---------------|------------|
| Dashboard con tarjetas | RF-02 | car-tracker/RF-02 | NO — se extiende con pestañas |
| Registro de vehículo | RF-01 | car-tracker/RF-01 | NO — se reutiliza con `vehicle_type` |
| Mantenimientos | RF-04 | car-tracker/RF-04 | NO — misma tabla, tipos adaptados |
| Alertas km/fecha | RF-03 | car-tracker/RF-06 | NO — misma lógica `alertLogic.js` |
| Historial | RF-05 | car-tracker/RF-05 | NO — mismo componente `MaintenanceList` |

**Solapamientos Encontrados**: 0 conflictos — todo se extiende, nada se duplica.

### Resolución de Solapamientos
La estrategia es **extender sin duplicar**: añadir un campo `vehicle_type` ('car' | 'motorcycle') a la tabla `cars` existente. Toda la lógica de mantenimientos, alertas e historial se reutiliza tal cual. Solo se adaptan los formularios y el dashboard.

---

## Resumen

Ampliar la app para que los usuarios puedan registrar también motocicletas, separadas visualmente de los coches en el dashboard. La moto tiene sus propios tipos de mantenimiento específicos (cadena, filtro de aire, bujías) y su propio icono, pero comparte toda la infraestructura existente.

---

## Problema

Un usuario que tiene tanto coche como moto no puede usar la app para su moto. Además, mezclar coches y motos en un mismo listado sin distinción visual sería confuso.

---

## Usuarios

Cualquier persona con uno o varios vehículos de dos o cuatro ruedas que quiera llevar el mantenimiento de todos desde una sola app.

---

## Alcance

### Incluido
- Campo `vehicle_type` en la tabla `cars` para distinguir coche / moto
- Dashboard con dos pestañas: "Coches" y "Motos"
- Formulario de registro adaptado a motos (sin campo ITV, con campo de cilindrada opcional)
- Tipos de mantenimiento específicos para motos: cadena, filtro de aire, bujías, frenos, líquido de frenos
- Icono y placeholder específico de moto (🏍️) en lugar del coche (🚗)
- Misma lógica de alertas, historial e indicadores de estado (verde/amarillo/rojo)

### Excluido (por ahora)
- Tipos de vehículo adicionales (camión, furgoneta, bicicleta eléctrica)
- Migración automática de registros existentes (todos los existentes son coches por defecto)
- Campos muy específicos de moto (tipo de suspensión, número de cilindros, etc.)

---

## Modelo de Datos

### Cambio en tabla `cars`
Añadir columna:
```sql
ALTER TABLE cars ADD COLUMN vehicle_type TEXT NOT NULL DEFAULT 'car'
  CHECK (vehicle_type IN ('car', 'motorcycle'));
```

### Cambio en tabla `maintenances`
Ampliar el CHECK de `type` para incluir tipos de moto:
```sql
ALTER TABLE maintenances DROP CONSTRAINT maintenances_type_check;
ALTER TABLE maintenances ADD CONSTRAINT maintenances_type_check
  CHECK (type IN ('oil', 'tires', 'itv', 'revision', 'chain', 'air_filter', 'spark_plugs', 'brakes', 'brake_fluid', 'custom'));
```

---

## Requisitos

### Funcionales

- **RF-01**: El usuario puede registrar una moto indicando marca, modelo, año, matrícula, foto, km y cilindrada (opcional)
- **RF-02**: El dashboard muestra dos pestañas separadas: "Coches" y "Motos", cada una con sus tarjetas
- **RF-03**: Las tarjetas de moto muestran el badge de estado verde/amarillo/rojo igual que los coches
- **RF-04**: El usuario puede registrar mantenimientos específicos de moto: cadena, filtro de aire, bujías, frenos, líquido de frenos
- **RF-05**: El historial, la edición y la eliminación de mantenimientos funciona igual para motos que para coches
- **RF-06**: El formulario de registro de moto no muestra el campo ITV (no aplica a motos)
- **RF-07**: El usuario puede editar y eliminar una moto igual que un coche

### No Funcionales

- **RNF-01 Reutilización**: Ningún componente existente se duplica; se parametrizan o extienden
- **RNF-02 Migración**: Los coches existentes en la BD no se ven afectados (DEFAULT 'car')
- **RNF-03 Consistencia**: El diseño visual de motos es idéntico al de coches, solo cambian iconos y etiquetas

---

## Flujo de Usuario Principal

1. El usuario abre la app y ve el dashboard con la pestaña "Coches" activa
2. Pulsa la pestaña "Motos"
3. Ve sus motos (o pantalla de bienvenida si no tiene ninguna)
4. Pulsa "Añadir moto" y rellena los datos
5. La moto aparece en la pestaña "Motos" con badge verde
6. Registra un mantenimiento de cadena a 15.000 km, próximo a 17.000 km
7. Cuando quedan menos de 1.000 km, el badge cambia a amarillo

---

## Dependencias

### Con Otros Features
- **car-tracker** (completado): Este feature extiende directamente su código. Reutiliza: `useCars.js`, `useMaintenances.js`, `alertLogic.js`, `CarCard`, `MaintenanceList`, `MaintenanceItem`, `ConfirmDialog`, `UpdateKmModal`.

### Técnicas
- Migración SQL en Supabase (2 ALTER TABLE, ejecutar manualmente)
- No se necesitan nuevas dependencias npm

---

## Notas
- La estrategia de `vehicle_type` en la misma tabla es más simple que crear una tabla `motorcycles` separada — toda la lógica de mantenimientos ya referencia `car_id` y funciona igual
- `cilindrada` se puede añadir como campo opcional en el formulario de motos; en la tabla basta con `notes` o un campo nuevo `engine_cc INTEGER`
- Los tipos de mantenimiento de moto se añaden al CHECK constraint y al `maintenanceTypes.js` existente
