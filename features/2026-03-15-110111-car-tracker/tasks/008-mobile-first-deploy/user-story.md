# Tarea 008: Optimización Mobile-First y Deploy

## Metadata
task_id: `008`
feature_id: `2026-03-15-110111-car-tracker`
requisito: `RF-09, RNF-01, RNF-02, RNF-03, RNF-04`
created_at: `2026-03-15T11:01:11Z`
status: `defined`
priority: `3`

## Análisis de Conflictos

### Tareas Relacionadas
- Todas las tareas anteriores (consuma la UI construida)

### Matriz de Conflictos

| Archivo/Recurso | Esta Tarea | Otra Tarea | Conflicto? |
|-----------------|------------|------------|------------|
| vercel.json / configuración deploy | crea | — | NO |
| CSS global / estilos | ajusta | 003, 006, 007 (estilos) | REVISAR |

**Conflictos Encontrados**: 0 (ajustes de estilo complementan, no reemplazan)

### Dependencias
- **Requiere completar antes**: 003, 006, 007
- **Bloquea a**: ninguna (tarea final)

## Historia de Usuario
**Como** usuario que accede desde el móvil
**Quiero** que la app se vea perfecta en pantalla pequeña, cargue rápido y esté disponible en una URL pública
**Para** usarla desde cualquier lugar sin instalar nada

## Criterios de Aceptación
- [ ] La app es completamente usable en viewport de 375px (iPhone SE) sin scroll horizontal
- [ ] Los botones y elementos táctiles tienen tamaño mínimo de 44px para facilitar el toque
- [ ] La app está desplegada en Vercel con URL pública accesible desde cualquier dispositivo
- [ ] La app carga en menos de 3 segundos en una conexión 4G (Lighthouse performance > 70)
- [ ] Favicon y meta tags básicos configurados (título, descripción)

## Escenarios

### Escenario 1: Uso desde móvil
- **Dado** que el usuario accede a la URL de Vercel desde su iPhone
- **Cuando** navega por el dashboard, añade un coche y registra un mantenimiento
- **Entonces** todas las pantallas se ven correctamente sin elementos cortados ni scroll horizontal

### Escenario 2: Deploy exitoso
- **Dado** que el código está en el repositorio conectado a Vercel
- **Cuando** se hace push a la rama principal
- **Entonces** Vercel despliega automáticamente y la URL pública refleja los cambios

### Escenario 3: Carga rápida
- **Dado** que la app está desplegada
- **Cuando** se abre en Chrome DevTools simulando conexión 4G
- **Entonces** el dashboard es interactivo en menos de 3 segundos

## Notas
- Revisar que todos los formularios usan `input type="number"` para km en móvil (teclado numérico)
- Usar `viewport` meta tag correctamente: `width=device-width, initial-scale=1`
- Considerar `loading="lazy"` en imágenes de coches
- Vercel deployment: conectar con GitHub repo y configurar variables de entorno en el panel de Vercel
- Si sobra tiempo: añadir PWA manifest para que se pueda "instalar" en el home screen
