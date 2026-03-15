# Sistema de Autenticación de Usuarios

## Metadata
feature_id: `2026-03-15-140000-auth-usuarios`
created_at: `2026-03-15T14:00:00Z`
status: `prd_created`

## Análisis de PRDs Existentes

### PRDs Revisados
- `features/2026-03-15-121115-soporte-motos/prd.md` — Soporte para motos

### Matriz de Solapamiento

| Aspecto | Este PRD | PRD Existente | Conflicto? |
|---------|----------|---------------|------------|
| Tabla `cars` | RF-02 (añadir user_id) | soporte-motos/RF-01 (vehicle_type) | NO |
| Tabla `maintenances` | RF-02 (RLS indirecto) | soporte-motos (tipos moto) | NO |
| Rutas de la app | RF-04 (rutas protegidas) | soporte-motos/RF-02 (/motorcycles/new) | NO |

**Solapamientos Encontrados**: 0

## Resumen
Añadir un sistema de cuentas de usuario para que cada persona tenga su propio espacio privado en la app. Actualmente todos los datos son compartidos. Con este feature, cada usuario se registra con email y contraseña, y solo ve sus propios vehículos y mantenimientos.

## Problema
La app funciona perfectamente para una sola persona, pero si varias personas la usan, ven los vehículos y mantenimientos de todos. No hay forma de separar los datos por usuario ni de proteger la información personal.

## Usuarios
Cualquier persona que quiera gestionar sus vehículos de forma privada. Especialmente útil cuando la app se comparte con familia, amigos o compañeros de trabajo.

## Alcance

### Incluido
- Registro con email y contraseña
- Login con email y contraseña
- Logout
- Rutas protegidas (redirigir a login si no autenticado)
- Aislamiento de datos: cada usuario solo ve sus vehículos y mantenimientos
- Migración de base de datos con RLS (Row Level Security) en Supabase
- Indicador del usuario actual en el dashboard (email + botón logout)

### Excluido (por ahora)
- Login social (Google, Apple, GitHub)
- Recuperación de contraseña por email
- Editar perfil / cambiar contraseña desde la app
- Verificación de email obligatoria
- Roles o permisos (admin, usuario)

## Requisitos

### Funcionales
- **RF-01**: El usuario puede registrarse con email y contraseña desde una pantalla de registro
- **RF-02**: La base de datos aísla los datos por usuario mediante `user_id` en `cars` y RLS en Supabase
- **RF-03**: El usuario puede iniciar sesión con email y contraseña desde una pantalla de login
- **RF-04**: Todas las rutas excepto `/login` y `/register` redirigen al usuario no autenticado a `/login`
- **RF-05**: El usuario puede cerrar sesión desde el dashboard
- **RF-06**: Al crear un vehículo, se asocia automáticamente al usuario autenticado (`user_id`)
- **RF-07**: Las consultas a `cars` solo devuelven los vehículos del usuario autenticado (via RLS)

### No Funcionales
- **RNF-01 Seguridad**: Las políticas RLS de Supabase garantizan que ningún usuario pueda leer o modificar datos de otro, incluso llamando directamente a la API
- **RNF-02 Usabilidad**: El flujo login → app debe completarse en menos de 3 pasos; formularios con validación inline
- **RNF-03 Persistencia**: La sesión se mantiene al recargar la página (Supabase gestiona el token en localStorage)

## Flujo de Usuario

### Registro
1. El usuario abre la app por primera vez y ve la pantalla de login
2. Pulsa "Crear cuenta"
3. Introduce email y contraseña
4. El sistema crea la cuenta en Supabase Auth y abre sesión automáticamente
5. Resultado: el usuario llega al dashboard vacío, listo para añadir su primer vehículo

### Login
1. El usuario abre la app (sin sesión activa) y ve la pantalla de login
2. Introduce email y contraseña
3. El sistema valida credenciales contra Supabase Auth
4. Resultado: el usuario llega al dashboard con sus vehículos

### Logout
1. El usuario pulsa su email / botón "Salir" en el dashboard
2. El sistema cierra la sesión (borra token)
3. Resultado: el usuario ve la pantalla de login

## Dependencias

### Con Otros Features
- **Car Tracker** (`2026-03-15-110111-car-tracker`): todas las operaciones CRUD de coches y mantenimientos dependen de este feature para funcionar con aislamiento de datos
- **Soporte Motos** (`2026-03-15-121115-soporte-motos`): igual que car tracker — las motos también quedarán aisladas por usuario una vez habilitado RLS

### Técnicas
- **Supabase Auth**: ya incluido en `@supabase/supabase-js`, no requiere dependencias nuevas
- **React Router v7**: ya instalado, se usará para proteger rutas con un componente `<RequireAuth>`
- **`src/lib/supabase.js`**: cliente Supabase existente, se usará para llamadas de auth
- **SQL migration**: añadir `user_id UUID REFERENCES auth.users` a `cars`, habilitar RLS y crear políticas

## Notas
- Supabase Auth está habilitado por defecto en todos los proyectos; no requiere configuración adicional
- RLS en Supabase hace que los filtros sean automáticos: `getCars()` no necesita cambiar el código, simplemente dejará de devolver vehículos de otros usuarios
- La única operación que sí necesita cambio de código es `createCar`, que debe incluir `user_id: supabase.auth.getUser().id`
- Los datos existentes en la tabla `cars` (sin `user_id`) quedarán huérfanos tras la migración; aceptable para un hackathon
