# Tarea 004: Integración — user_id en datos y logout en dashboard

## Metadata
task_id: `004`
feature_id: `2026-03-15-140000-auth-usuarios`
requisito: `RF-05, RF-06`
created_at: `2026-03-15T14:00:00Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 001-migracion-rls — debe completarse antes (sin user_id en BD, el insert falla)
- 002-auth-contexto — debe completarse antes (provee useAuth para obtener user.id)

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `src/hooks/useCars.js` | MODIFICAR (createCar + user_id) | ninguna activa | NO |
| `src/pages/DashboardPage.jsx` | MODIFICAR (email + logout) | ninguna activa | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 001-migracion-rls, 002-auth-contexto
- **Bloquea a**: ninguna

## Historia de Usuario
**Como** usuario autenticado
**Quiero** que mis vehículos se guarden asociados a mi cuenta y poder cerrar sesión desde el dashboard
**Para** que mis datos sean privados y pueda salir cuando quiera

## Criterios de Aceptación
- [ ] `createCar` en `useCars.js` incluye `user_id` del usuario autenticado en el insert
- [ ] El dashboard muestra el email del usuario actual en el header
- [ ] Hay un botón "Salir" en el dashboard que llama a `signOut()`
- [ ] Tras el logout, el usuario es redirigido a `/login`

## Escenarios

### Escenario 1: Crear vehículo como usuario autenticado
- **Dado** que el usuario está autenticado con su cuenta
- **Cuando** guarda un nuevo coche o moto
- **Entonces** el registro en `cars` tiene `user_id = auth.uid()` y RLS lo asocia a su cuenta

### Escenario 2: Logout desde el dashboard
- **Dado** que el usuario está en el dashboard
- **Cuando** pulsa "Salir"
- **Entonces** la sesión se cierra y ve la pantalla de login

## Notas
- `createCar` debe llamar a `supabase.auth.getUser()` para obtener el `user.id` antes del insert
- Alternativamente, con RLS habilitado, la función `auth.uid()` de Postgres puede insertar automáticamente el user_id si la política lo define — valorar el enfoque más simple
- El email en el header puede ser truncado si es muy largo (max-w + truncate)
- El botón Salir debe estar visible pero discreto para no interrumpir el flujo principal
