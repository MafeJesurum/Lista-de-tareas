# Mis Tareas — Demo de despliegue

Proyecto de ejemplo para la asignatura **Buenas Prácticas de Desarrollo de Software** (CUC).

Es una lista de tareas sencilla, hecha con **HTML, CSS y JavaScript puro** (sin frameworks
ni pasos de build), pensada para que el docente la use como demo en clase y luego cada
equipo repita el mismo flujo con su propio proyecto.

## Estructura del proyecto

```
demo-lista-tareas/
├── index.html      # estructura de la página
├── style.css        # estilos (clases en kebab-case)
├── script.js        # lógica de la app (variables/funciones en camelCase)
├── netlify.toml      # configuración de despliegue
└── README.md
```

## Cómo usarlo como demo en clase

### 1. Subir el proyecto a GitHub (rama `main`)

```bash
git init
git add .
git commit -m "feat: primera versión de la app de tareas"
git branch -M main
git remote add origin https://github.com/tu-usuario/demo-lista-tareas.git
git push -u origin main
```

### 2. Desplegar en Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**.
2. Elige GitHub y autoriza el acceso.
3. Selecciona el repositorio `demo-lista-tareas`.
4. Branch a desplegar: **main**.
5. Build command: (vacío) — Publish directory: `.`
6. **Deploy site**. En unos segundos tendrás una URL pública funcionando.

### 3. Ver la integración continua en acción

Haz un cambio pequeño (por ejemplo, el texto del `<h1>` en `index.html`), confírmalo y
súbelo a `main`:

```bash
git add .
git commit -m "docs: ajusta el título de la app"
git push
```

Netlify vuelve a desplegar el sitio automáticamente — sin tocar nada en su panel.

## Para los estudiantes: cómo replicarlo con su proyecto

El objetivo no es copiar esta app, sino repetir el mismo proceso con el proyecto de su
equipo:

1. Revisen los nombres de sus variables, funciones y archivos (Clase 3).
2. Confirmen sus cambios con mensajes tipo `feat:`, `fix:`, `refactor:`...
3. Suban su rama, abran su Pull Request hacia `dev`.
4. Cuando el proyecto esté listo en `main`, conéctenlo a Netlify siguiendo los mismos
   pasos de esta guía.
5. Compartan la URL pública de su equipo.

## Funcionalidad de la app

- Agregar tareas nuevas.
- Marcarlas como completadas.
- Eliminarlas.
- Las tareas se guardan en el navegador (`localStorage`), así que no se pierden al recargar.
