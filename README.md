# Lista de Tareas CUC

## 1. Nombre del proyecto y descripción

Lista de Tareas CUC es una aplicación web que permite organizar y administrar tareas mediante un tablero visual estilo Trello. Los usuarios pueden crear, editar, eliminar y mover tareas entre diferentes columnas: Por Hacer, En Progreso y Completadas.

El proyecto utiliza React para la interfaz y una API desarrollada con Node.js y Express para gestionar la información. Los datos se almacenan en archivos JSON dentro de un bucket privado de Amazon S3.

## 2. Integrantes

- **Valery Celedón:** Participación en el desarrollo e integración de avances del proyecto, incluyendo trabajo relacionado con el backend.
- **Mafe Jesurum:** Desarrollo e integración de funcionalidades del proyecto. Responsabilidades específicas por completar.
- **Benjamín Urrea:** Desarrollo del frontend en React, componentes, hook useTablero, servicios, drag and drop, modales, estilos y pruebas automatizadas.

## 3. Tecnologías utilizadas

- HTML5 y CSS3.
- JavaScript.
- React.
- Vite.
- Node.js.
- Express.
- Vitest y Testing Library.
- Node.js Test Runner.
- Amazon Web Services (AWS).
- Amazon S3 para almacenamiento.
- Amazon EC2 para ejecutar la API.
- Git y GitHub para el control de versiones.

## 4. Instalación y ejecución local

El proyecto está organizado en dos carpetas principales:

- `frontend/`: contiene la aplicación desarrollada en React con Vite.
- `api/`: contiene el servidor desarrollado con Node.js y Express.

Para preparar el proyecto:

1. Clonar el repositorio.
2. Instalar las dependencias del frontend y del backend.
3. Configurar las variables de entorno utilizando los archivos `.env.example` de cada carpeta.
4. Iniciar el servidor y el frontend utilizando los scripts definidos en sus respectivos archivos `package.json`.

### Variables de entorno

**Frontend (`frontend/.env`)**

- `VITE_API_URL`: dirección de la API.

**Backend (`api/.env`)**

- `PORT`: puerto del servidor.
- `FRONTEND_ORIGIN`: URL del frontend autorizado.
- `AWS_REGION`: región de AWS.
- Nombre del bucket privado de S3.

Los valores reales de configuración deben establecerse localmente y no deben publicarse en GitHub.

## 5. Endpoints de la API

La API permite gestionar columnas, tareas y consultar un resumen del tablero.

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/columnas` | Listar columnas |
| POST | `/api/columnas` | Crear columna |
| PATCH | `/api/columnas/:id` | Renombrar o cambiar color |
| DELETE | `/api/columnas/:id` | Eliminar columna y sus tareas |
| GET | `/api/tareas` | Listar tareas |
| POST | `/api/tareas` | Crear tarea |
| PATCH | `/api/tareas/:id` | Editar o mover tarea |
| DELETE | `/api/tareas/:id` | Eliminar tarea |
| GET | `/api/resumen` | Consultar resumen del tablero |

Los endpoints utilizan respuestas HTTP como 200, 201, 204, 400 y 404, según el resultado de cada operación.

## 6. Pruebas automatizadas

El proyecto cuenta con 22 pruebas automatizadas:

- **Backend:** 15 pruebas utilizando Node.js Test Runner.
- **Frontend:** 7 pruebas utilizando Vitest y Testing Library.

Para ejecutar las pruebas del backend:

```bash
cd api
npm test
```

Para ejecutar las pruebas del frontend:

```bash
cd frontend
npm test
```

Las pruebas verifican la creación, edición, movimiento y eliminación de tareas y columnas, además de validar errores y situaciones límite.

## 7. Despliegue en AWS

El proyecto utiliza Amazon S3 para publicar el frontend y almacenar los datos del backend. Amazon EC2 se utiliza para ejecutar la API.

### Sitios publicados en S3

| Integrante | URL |
|---|---|
| Benjamín Urrea | http://cuc-bp-eq81-urrea-sitio-2026.s3-website-us-east-1.amazonaws.com |
| Valery Celedón | http://cuc-bp-eq81-celedon-sitio-2026.s3-website-us-east-1.amazonaws.com |
| Mafe Jesurum | http://cuc-bp-eq81-jesurum-sitio-2026.s3-website-us-east-1.amazonaws.com |

### Pasos generales de despliegue

1. Configurar la instancia EC2 con el perfil de permisos correspondiente.
2. Configurar las variables de entorno del backend.
3. Ejecutar la API como servicio.
4. Comprobar que la API responda desde la IP pública.
5. Configurar CORS con la URL del frontend.
6. Configurar `VITE_API_URL` en `.env.production`.
7. Generar la compilación con `npm run build`.
8. Subir el contenido de la carpeta `dist/` al bucket S3 público.
9. Verificar el funcionamiento del frontend y la conexión con la API.
10. Cerrar los recursos de AWS al finalizar las pruebas.

La dirección IP pública de EC2 debe agregarse cuando se confirme la IP definitiva del despliegue.

### Almacenamiento privado

Los datos de las columnas y tareas se almacenan en los archivos:

- `datos/columnas.json`
- `datos/tareas.json`

Estos archivos se guardan en un bucket privado de Amazon S3.

## Seguridad

- Validación de datos desde el backend.
- Protección de variables de entorno y secretos mediante `.gitignore`.
- Archivos `.env.example` para documentar la configuración.
- CORS restringido al origen autorizado.
- Security Group con acceso mínimo necesario.
- SSH cerrado según los requisitos del proyecto.

La auditoría de dependencias realizada el 24/11/2026 reportó cero vulnerabilidades en el backend y el frontend.

cuc-bp-eq81-celedon-privado-2026 |
|Mafe Jesurum | http://cuc-bp-eq81-jesurum-sitio-2026.s3-website-us-east-1.amazonaws.com | cuc-bp-eq81-jesurum-sitio-2026 | cuc-bp-eq81-jesurum-privado-2026 |
