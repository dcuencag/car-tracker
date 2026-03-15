# Tarea 003: Dashboard con Pestañas Coches / Motos

## Metadata
task_id: `003`
feature_id: `2026-03-15-121115-soporte-motos`
requisito: `RF-02, RF-03`
created_at: `2026-03-15T12:11:15Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 002 (crud motos) — necesario para tener motos que mostrar
- car-tracker/003 (completada) — creó DashboardPage que se modifica aquí
- car-tracker/007 (completada) — badge de estado ya implementado en CarCard

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `src/pages/DashboardPage.jsx` | modifica (añade pestañas) | car-tracker/003 (completada) | NO |
| `src/components/CarCard.jsx` | sin cambios (badge ya funciona) | — | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 002
- **Bloquea a**: ninguna

## Historia de Usuario
**Como** usuario con coches y motos
**Quiero** ver dos secciones separadas en el dashboard
**Para** distinguir fácilmente mis coches de mis motos de un vistazo

## Criterios de Aceptación
- [ ] El dashboard muestra dos pestañas: "Coches 🚗" y "Motos 🏍️"
- [ ] La pestaña activa filtra los vehículos por `vehicle_type`
- [ ] Cada vehículo muestra el icono correcto (🚗 o 🏍️) como placeholder si no tiene foto
- [ ] El botón "+" añade el tipo correcto según la pestaña activa
- [ ] Si una pestaña está vacía, muestra pantalla de bienvenida específica ("Añade tu primera moto")

## Escenarios

### Escenario 1: Usuario con coches y motos
- **Dado** que el usuario tiene 2 coches y 1 moto
- **Cuando** pulsa la pestaña "Motos"
- **Entonces** ve solo la moto con su badge de estado

### Escenario 2: Pestaña vacía
- **Dado** que el usuario no tiene motos
- **Cuando** pulsa la pestaña "Motos"
- **Entonces** ve "Aún no tienes motos" con botón "Añadir mi primera moto"

### Escenario 3: Añadir desde pestaña correcta
- **Dado** que el usuario está en la pestaña "Motos"
- **Cuando** pulsa el botón "+"
- **Entonces** navega al formulario de nueva moto (con `vehicle_type = 'motorcycle'`)

## Notas
- La pestaña activa se puede guardar en `useState` local (no necesita URL ni localStorage)
- El filtrado se hace en frontend sobre los datos ya cargados (no nueva query)
- `CarCard` ya soporta el badge — solo hay que pasarle el status correcto
- El placeholder de imagen cambia según `vehicle_type`: 🚗 para coches, 🏍️ para motos
