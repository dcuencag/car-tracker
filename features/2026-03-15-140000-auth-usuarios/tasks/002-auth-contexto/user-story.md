# Tarea 002: Contexto de Autenticación (AuthContext + useAuth)

## Metadata
task_id: `002`
feature_id: `2026-03-15-140000-auth-usuarios`
requisito: `RF-03, RF-05`
created_at: `2026-03-15T14:00:00Z`
status: `defined`
priority: `1`

## Análisis de Conflictos

### Tareas Relacionadas
- 003-paginas-auth (este feature) — depende de useAuth
- 004-integracion-usuario (este feature) — depende de useAuth

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `src/contexts/AuthContext.jsx` | CREAR | ninguna | NO |
| `src/main.jsx` | MODIFICAR (wrap con AuthProvider) | ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: ninguna
- **Bloquea a**: 003-paginas-auth, 004-integracion-usuario

## Historia de Usuario
**Como** desarrollador
**Quiero** un contexto React que gestione la sesión del usuario
**Para** que cualquier componente pueda saber si hay un usuario autenticado y quién es

## Criterios de Aceptación
- [ ] Existe `src/contexts/AuthContext.jsx` con `AuthProvider` y hook `useAuth`
- [ ] `useAuth` expone `{ user, loading, signIn, signUp, signOut }`
- [ ] La sesión se restaura automáticamente al recargar (via `supabase.auth.onAuthStateChange`)
- [ ] `main.jsx` envuelve la app con `<AuthProvider>`
- [ ] Mientras se verifica la sesión inicial, `loading` es `true`

## Escenarios

### Escenario 1: Usuario con sesión activa recarga la página
- **Dado** que el usuario inició sesión anteriormente
- **Cuando** recarga la página
- **Entonces** `useAuth().user` tiene el usuario sin necesidad de volver a hacer login

### Escenario 2: Logout
- **Dado** que el usuario está autenticado
- **Cuando** llama a `signOut()`
- **Entonces** `user` pasa a ser `null`

## Notas
- Usar `supabase.auth.getSession()` para la sesión inicial
- Usar `supabase.auth.onAuthStateChange()` para escuchar cambios
- `signIn` llama a `supabase.auth.signInWithPassword({ email, password })`
- `signUp` llama a `supabase.auth.signUp({ email, password })`
- `signOut` llama a `supabase.auth.signOut()`
- Limpiar el listener en el `useEffect` cleanup para evitar memory leaks
