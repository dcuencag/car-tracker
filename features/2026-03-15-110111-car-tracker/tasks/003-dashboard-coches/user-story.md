# Tarea 003: Dashboard de Coches

## Metadata
task_id: `003`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `RF-02`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 002 (crud coches) — fuente de datos
- 007 (indicadores de estado) — añadirá el semáforo a las tarjetas

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| Dashboard component | crea | — | NO |
| CarCard component | crea | 007 (extiende) | REVISAR |

**Conflictos Encontrados**: 0 (007 extiende CarCard, no conflicto si la tarea 007 se hace después)

### Dependencias
- **Requiere completar antes**: 002
- **Bloquea a**: 007, 008

## Historia de Usuario
**Como** usuario con coches registrados
**Quiero** ver todos mis coches en un dashboard con tarjetas visuales
**Para** tener una visión rápida del estado de mi flota de vehículos

## Criterios de Aceptación
- [ ] El dashboard muestra una tarjeta por cada coche registrado
- [ ] Cada tarjeta muestra: foto (o placeholder), marca + modelo, matrícula, km actuales
- [ ] Si no hay coches, se muestra una pantalla de bienvenida con botón "Añadir tu primer coche"
- [ ] Cada tarjeta tiene acceso a la ficha detallada del coche
- [ ] Botón flotante o CTA visible para añadir un nuevo coche

## Escenarios

### Escenario 1: Usuario con coches registrados
- **Dado** que el usuario tiene 2 coches en Supabase
- **Cuando** abre la app
- **Entonces** ve 2 tarjetas con la información básica de cada coche

### Escenario 2: Usuario sin coches
- **Dado** que el usuario no tiene coches registrados
- **Cuando** abre la app
- **Entonces** ve una pantalla de bienvenida con mensaje motivador y botón para añadir el primer coche

### Escenario 3: Navegar a ficha del coche
- **Dado** que el usuario está en el dashboard
- **Cuando** pulsa en la tarjeta de un coche
- **Entonces** navega a la ficha detallada de ese coche

## Notas
- Diseño mobile-first: tarjetas en columna única en móvil, grid en tablet/desktop
- Placeholder de imagen si `photo_url` está vacío (ej: icono de coche genérico)
- La tarjeta reservará espacio para el indicador de estado (verde/amarillo/rojo) que añadirá la tarea 007
