# Car Tracker — Registro y mantenimiento de vehículos

## Metadata
feature_id: `2026-03-15-110111-car-tracker`
created_at: `2026-03-15T11:01:11Z`
status: `prd_created`

---

## Resumen

App mobile-first para llevar el control completo de tus vehículos: kilometraje, aceite, neumáticos, ITV, revisiones y cualquier mantenimiento personalizado. Incluye alertas visuales y recordatorios por fecha o kilómetros.

Pensada para ser desarrollada en un día (hackathon), con stack React + Vite + Tailwind + Supabase, desplegada en Vercel.

---

## Problema

No existe una forma sencilla y visual de llevar el historial de mantenimiento de tu coche desde el móvil. Las personas olvidan cuándo fue la última revisión, cuántos km llevan desde el último cambio de aceite, o cuándo vence la ITV.

---

## Usuarios

Cualquier persona con uno o varios vehículos que quiera tener un registro claro y accesible desde el móvil, sin depender de papel o de recordar de memoria.

---

## Alcance

### Incluido
- Registro de uno o varios coches (marca, modelo, año, matrícula, foto, km actuales)
- Dashboard con tarjetas visuales por coche
- Indicadores de estado en color (verde / amarillo / rojo)
- Registro de mantenimientos: aceite, neumáticos, ITV, revisión general, personalizado
- Historial de mantenimientos por coche
- Sistema de alertas por km o por fecha
- Vista de próximas revisiones pendientes
- Diseño responsive mobile-first
- Deploy en Vercel con URL pública accesible desde el móvil

### Excluido (por ahora)
- Notificaciones push nativas
- Integración con taller o agenda
- Escáner de matrícula automático
- Modo multi-usuario / compartir coche
- App nativa (iOS / Android)
- Exportar historial a PDF

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + API REST gratis) |
| Deploy | Vercel |

---

## Modelo de Datos

### Tabla: `cars`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| brand | text | Marca (Toyota, Seat...) |
| model | text | Modelo |
| year | integer | Año de fabricación |
| plate | text | Matrícula |
| photo_url | text | URL de imagen |
| current_km | integer | Kilometraje actual |
| created_at | timestamp | Fecha de registro |

### Tabla: `maintenances`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| car_id | uuid | FK → cars |
| type | text | oil / tires / itv / revision / custom |
| label | text | Nombre del mantenimiento |
| done_at | date | Fecha en que se realizó |
| done_km | integer | Km en que se realizó |
| next_date | date | Próxima revisión por fecha |
| next_km | integer | Próxima revisión por km |
| notes | text | Notas opcionales |

---

## Requisitos

### Funcionales

- **RF-01**: El usuario puede registrar un coche con marca, modelo, año, matrícula, foto y km actuales
- **RF-02**: El usuario puede ver todos sus coches en un dashboard con tarjetas visuales
- **RF-03**: Cada tarjeta muestra el estado general del coche (verde / amarillo / rojo) según revisiones pendientes
- **RF-04**: El usuario puede registrar un mantenimiento (tipo, fecha, km, próxima fecha/km)
- **RF-05**: El usuario puede ver el historial completo de mantenimientos de cada coche
- **RF-06**: El sistema muestra alertas cuando un mantenimiento está próximo (por fecha o por km)
- **RF-07**: El usuario puede actualizar el kilometraje actual de su coche en cualquier momento
- **RF-08**: El usuario puede editar o eliminar un coche o mantenimiento registrado
- **RF-09**: La app es usable desde el móvil sin instalar nada (web responsive)

### No Funcionales

- **RNF-01 Rendimiento**: La app carga en menos de 2 segundos en 4G
- **RNF-02 Usabilidad**: Interfaz simple, sin curva de aprendizaje; cualquier persona puede usarla sin instrucciones
- **RNF-03 Visual**: Diseño mobile-first con indicadores de estado claros y colores intuitivos
- **RNF-04 Despliegue**: URL pública accesible desde cualquier móvil sin instalación

---

## Flujo de Usuario Principal

1. El usuario abre la app desde el móvil
2. Ve el dashboard con sus coches (o pantalla de bienvenida si no tiene ninguno)
3. Pulsa "Añadir coche" y rellena los datos básicos
4. Accede a la ficha del coche y ve su estado general
5. Registra un mantenimiento (ej: cambio de aceite a 50.000 km, próximo a 60.000 km)
6. La tarjeta del coche muestra indicador amarillo cuando quedan menos de 1.000 km para la próxima revisión
7. La tarjeta muestra indicador rojo cuando la revisión está vencida

---

## Plan de desarrollo (8 horas)

| Bloque | Tiempo | Qué construir |
|--------|--------|---------------|
| 1 | 0h – 2h | Setup (Vite + Tailwind + Supabase), modelo de datos, CRUD básico de coches |
| 2 | 2h – 4h | Dashboard con tarjetas visuales, indicadores de estado, navegación |
| 3 | 4h – 6h | Registro de mantenimientos, historial, lógica de alertas |
| 4 | 6h – 8h | Pulido visual mobile-first, deploy en Vercel |

---

## Dependencias Técnicas

- Cuenta gratuita en [Supabase](https://supabase.com)
- Cuenta gratuita en [Vercel](https://vercel.com)
- Node.js instalado localmente

---

## Notas

- Priorizar funcionalidad core sobre features extra: registro + historial + alertas es el MVP ganador
- El indicador visual de estado (verde/amarillo/rojo) es el elemento más impactante para el jurado — cuidar su diseño
- Si sobra tiempo: añadir gráfica de km acumulados en el tiempo por coche
