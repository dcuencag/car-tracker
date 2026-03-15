# Landing Page HTML estática para SanzClima

## Metadata
feature_id: `2026-03-15-landing-page`
created_at: `2026-03-15T14:36:51Z`
status: `prd_created`

## Análisis de PRDs Existentes

### PRDs Revisados
- `features/2026-03-15-121115-soporte-motos/prd.md`
- `features/2026-03-15-140000-auth-usuarios/prd.md`

### Matriz de Solapamiento

| Aspecto | Este PRD | PRD Existente | Conflicto? |
|---------|----------|---------------|------------|
| Pantalla de login | RF-03 (CTA → /login) | auth-usuarios/RF-03 | NO — solo enlaza, no duplica |
| Registro | RF-03 (CTA → /register) | auth-usuarios/RF-01 | NO — solo enlaza |
| Listado de funciones | RF-02 | car-tracker, motos | NO — es contenido marketing |

**Solapamientos Encontrados**: 0

## Resumen
Landing page autocontenida (un solo `.html`) que presenta SanzClima al usuario antes de que entre a la app. Muestra el valor de la herramienta, sus funciones principales y lleva al usuario a registrarse o iniciar sesión.

## Problema
Actualmente la app no tiene página de presentación pública. Un nuevo usuario que llegue a la URL ve directamente el login sin entender qué es la app ni por qué debería usarla.

## Usuarios
- **Nuevo visitante**: llega por primera vez, necesita entender qué hace la app antes de registrarse.
- **Usuario existente**: quiere acceder rápidamente al login.

## Alcance

### Incluido
- Hero con nombre, tagline y CTA principal (Empezar gratis / Iniciar sesión)
- Sección de funcionalidades con iconos y descripciones
- Sección de tipos de vehículos soportados (coches y motos)
- Footer con nombre del producto
- Diseño mobile-first responsive
- Un único archivo `landing.html` autocontenido con Tailwind CSS vía CDN

### Excluido (por ahora)
- Animaciones complejas o JavaScript pesado
- Blog o contenido dinámico
- Formulario de contacto
- Precios o planes
- Testimonios o capturas de pantalla reales

## Requisitos

### Funcionales
- **RF-01**: La página muestra el nombre "SanzClima" y un tagline que resume el valor de la app en una línea
- **RF-02**: La página muestra al menos 5 funcionalidades clave con icono, título y descripción breve
- **RF-03**: La página contiene un CTA principal "Empezar gratis" que lleva a `/register` y un CTA secundario "Iniciar sesión" que lleva a `/login`
- **RF-04**: La página muestra los dos tipos de vehículos soportados: coches y motos
- **RF-05**: El archivo es un único `landing.html` que funciona sin servidor ni build (abre directamente en el navegador)

### No Funcionales
- **RNF-01 Rendimiento**: Carga en menos de 2s; solo depende de Tailwind CDN, sin otras librerías
- **RNF-02 Usabilidad**: Mobile-first, legible desde 320px de ancho, botones con área táctil mínima de 44px
- **RNF-03 Mantenimiento**: Todo el contenido editable está en el HTML, sin lógica externa

## Flujo de Usuario
1. El usuario llega a la landing page
2. Ve el hero con el nombre y tagline de SanzClima
3. Hace scroll y descubre las funcionalidades
4. Pulsa "Empezar gratis" → va a `/register`
5. O pulsa "Iniciar sesión" → va a `/login`

## Dependencias

### Con Otros Features
- `auth-usuarios`: los CTAs enlazan a `/login` y `/register` que ya existen

### Técnicas
- Tailwind CSS via CDN (`https://cdn.tailwindcss.com`)
- Sin dependencias de Node.js ni build

## Notas
- El archivo se crea en la raíz del proyecto como `landing.html`
- Los enlaces a `/login` y `/register` apuntarán a la URL de producción de Vercel o se pueden dejar como rutas relativas
