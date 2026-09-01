# Lista de Tareas CUC

Tablero de tareas estilo Trello, simplificado. Permite organizar tareas en columnas (Por Hacer, En Progreso, Completadas), moverlas entre estados y gestionarlas visualmente sin necesidad de cuenta ni backend.

## Alcance

Este proyecto es una aplicación web (HTML, CSS y JavaScript), sin inicio de sesión ni persistencia de datos: toda la información vive en memoria mientras el usuario tiene la página abierta, y se reinicia al recargar.

## Integrantes

- Valery Celedón
- Mafe Jesurum
- Benjamín Urrea

## Funcionalidades principales

1. **Gestión de tareas (CRUD de tarjetas)**
   Crear, editar y eliminar tareas dentro de una columna, con título, descripción y etiqueta/color asignados. Incluye el formulario/modal de "Añadir tarea".

2. **Tablero y movimiento entre columnas (Drag & Drop)**
   Estructura de columnas (Por Hacer, En Progreso, Completadas), arrastre de tarjetas entre columnas y actualización automática del contador de tareas por columna.

3. **Estado visual y recordatorios por correo**
   Etiquetas de color por categoría, estilo diferenciado para tareas completadas, y recordatorio por correo electrónico por tarjeta (mediante EmailJS) para avisar sobre tareas próximas a vencer. El envío depende de que la aplicación esté abierta en el navegador, dado que el proyecto no cuenta con backend.

## Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla)

## Estructura de ramas

- `main` — versión estable, desplegada en producción.
- `dev` — integración del trabajo diario del equipo.
- `pruebas` — rama de pruebas.
- `feature/nombre-integrante` — una por integrante, para el desarrollo de su funcionalidad.
