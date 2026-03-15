# Tarea 003: Páginas de Login y Registro + Rutas Protegidas

## Metadata
task_id: `003`
feature_id: `2026-03-15-140000-auth-usuarios`
requisito: `RF-01, RF-03, RF-04`
created_at: `2026-03-15T14:00:00Z`
status: `defined`
priority: `2`

## Análisis de Conflictos

### Tareas Relacionadas
- 002-auth-contexto — debe completarse antes (provee useAuth)

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| `src/App.jsx` | MODIFICAR (añadir rutas + RequireAuth) | ninguna activa | NO |
| `src/pages/LoginPage.jsx` | CREAR | ninguna | NO |
| `src/pages/RegisterPage.jsx` | CREAR | ninguna | NO |

**Conflictos Encontrados**: 0

### Dependencias
- **Requiere completar antes**: 002-auth-contexto
- **Bloquea a**: ninguna

## Historia de Usuario
**Como** usuario nuevo o existente
**Quiero** pantallas de login y registro, y que la app me redirija a login si no estoy autenticado
**Para** poder acceder a mis datos de forma segura

## Criterios de Aceptación
- [ ] Existe `LoginPage` con formulario email + contraseña y botón "Entrar"
- [ ] Existe `RegisterPage` con formulario email + contraseña y botón "Crear cuenta"
- [ ] Ambas páginas muestran errores inline si las credenciales son incorrectas o el email ya existe
- [ ] `App.jsx` tiene un componente `<RequireAuth>` que redirige a `/login` si no hay sesión
- [ ] Todas las rutas existentes (dashboard, coches, motos, mantenimientos) están protegidas con `<RequireAuth>`

## Escenarios

### Escenario 1: Usuario no autenticado intenta acceder al dashboard
- **Dado** que no hay sesión activa
- **Cuando** navega a `/`
- **Entonces** es redirigido automáticamente a `/login`

### Escenario 2: Login con credenciales incorrectas
- **Dado** que el usuario está en `/login`
- **Cuando** introduce una contraseña incorrecta
- **Entonces** ve un mensaje de error debajo del formulario sin recargar la página

### Escenario 3: Registro exitoso
- **Dado** que el usuario está en `/register`
- **Cuando** introduce email y contraseña válidos
- **Entonces** la cuenta se crea y es redirigido automáticamente al dashboard

## Notas
- `<RequireAuth>` usa `useAuth()` y `<Navigate to="/login" replace />` si `user === null`
- Mientras `loading === true`, mostrar pantalla de carga para evitar flash de redirección
- Los formularios deben ser mobile-first, coherentes visualmente con el resto de la app
- Enlace "¿No tienes cuenta? Regístrate" en LoginPage y viceversa
