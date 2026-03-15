# Tarea 002: Registro y Gestión de Coches

## Metadata
task_id: `002`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `RF-01, RF-08`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
- 001 (setup) — debe estar completa
- 003 (dashboard) — consume los datos creados aquí

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| tabla `cars` | crea/modifica registros | — | NO |
| CarForm component | crea | — | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 001
- **Bloquea a**: 003, 004, 005

## Historia de Usuario
**Como** usuario con un vehículo
**Quiero** poder añadir, editar y eliminar mis coches con sus datos básicos
**Para** tener un registro de todos mis vehículos en la aplicación

## Criterios de Aceptación
- [ ] Formulario para añadir coche con campos: marca, modelo, año, matrícula, foto (URL), km actuales
- [ ] El coche se guarda en Supabase y aparece disponible inmediatamente
- [ ] El usuario puede editar cualquier campo de un coche existente
- [ ] El usuario puede eliminar un coche (con confirmación)
- [ ] Validación básica: marca, modelo y km son obligatorios

## Escenarios

### Escenario 1: Añadir coche correctamente
- **Dado** que el usuario está en el formulario de nuevo coche
- **Cuando** rellena los campos obligatorios y pulsa "Guardar"
- **Entonces** el coche se crea en Supabase y el usuario es redirigido al dashboard

### Escenario 2: Intentar guardar sin campos obligatorios
- **Dado** que el usuario está en el formulario
- **Cuando** deja en blanco marca, modelo o km y pulsa "Guardar"
- **Entonces** se muestran mensajes de error en los campos vacíos y no se guarda

### Escenario 3: Eliminar un coche
- **Dado** que el usuario tiene un coche registrado
- **Cuando** pulsa "Eliminar" en la ficha del coche
- **Entonces** aparece un diálogo de confirmación; si confirma, el coche se borra y desaparece del dashboard

## Notas
- La foto es una URL de imagen (no upload de archivo para simplificar en hackathon)
- Al eliminar un coche, eliminar también sus mantenimientos asociados (CASCADE en Supabase o delete manual)
- Redirigir al dashboard tras crear/editar con éxito
