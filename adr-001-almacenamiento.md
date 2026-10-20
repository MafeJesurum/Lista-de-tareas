# ADR-001: Diseño del almacenamiento del proyecto en Amazon S3
- Fecha: 20-10-2026
- Autor: Mafe Jesurum
- Estado: Aceptada
## Contexto
El proyecto "Lista de Tareas CUC" es un tablero de tareas publicado como sitio estático en un bucket de S3. 
Hasta ahora no tenía protección: si se borraba un archivo por error, el sitio se caía y había que volver a subirlo. 
Además, el proyecto empezará a manejar usuarios, respaldos, adjuntos y registros de actividad, y no existía un lugar definido para guardarlos ni un criterio sobre quién puede leerlos. Por último, activar el historial de versionado genera un costo que crece con cada versión guardada si no se controla.
## Decision
Se usan dos buckets en US East (N. Virginia):

- Bucket del sitio: público, solo lectura, con los archivos del sitio. Versionado activado y regla de ciclo de vida
  `retencion-sitio`: pasa a Standard-IA a los 30 días, a Glacier a los 90 días y elimina versiones no vigentes
  a los 365 días.
- Bucket privado: acceso público bloqueado, versionado activado y organizado en los prefijos
  `archivos-sitio/`, `data-usuarios/`, `registros-actividad/`, `archivos-adjuntos-t/`  y `respaldos-info/`.
## Alternativas consideradas
- Mantener el sitio en Netlify: no ofrece almacenamiento privado ni control de versionado y ciclo de vida.
- Un solo bucket para todo: si es público expone los datos de usuarios; si es privado, el sitio no carga.
- No activar versionado: cualquier borrado sería permanente, y los datos del bucket privado no tienen otra copia.
- Versionado sin ciclo de vida: las versiones se acumulan sin límite y el costo crece indefinidamente.
## Consecuencias
### Positivas
- Los errores se pueden deshacer sin volver a subir archivos.
- Los datos sensibles quedan separados del sitio público.
- La regla reduce el costo estimado de aprox. $2.76 a $1.94 al año (cerca de 30% de ahorro).

### Costos o desventajas que aceptamos
- Se paga por cada versión guardada, y con 365 días ninguna versión vieja se borra durante el primer año.
- Glacier tarda horas en recuperar un archivo.

### Que habria que revisar mas adelante
- Si un archivo del sitio pasa a Glacier a los 90 días, el sitio deja de poder servirlo, convendria excluirlo de esa transición.
- Definir reglas de ciclo de vida para el bucket privado cuando tenga datos reales.