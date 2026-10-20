


```markdown
# ADR-001: Diseño del almacenamiento del proyecto en Amazon S3- Fecha: 20/10/2026- Autor: Valery Celedón- Estado: Aceptada

## Contexto
Anteriormente, el proyecto no contaba con una estrategia estructurada ni estandarizada para el almacenamiento y retención de sus archivos y sitios. Los objetos se gestionaban de forma directa sin políticas automáticas de ciclo de vida, lo que representaba un riesgo de incremento no controlado en los costos de almacenamiento a largo plazo y la falta de resguardo histórico para versiones previas. Se requiere definir una arquitectura segura, duradera y optimizada en costos en Amazon S3 para albergar los datos del proyecto con políticas de retención y versionado claras.

## Decisión
Se adoptó la siguiente estructura y configuración de almacenamiento en Amazon S3:
- **Bucket principal:** Un bucket de acceso público denominado `cuc-bp-eq81-celedon-sitio-2026` ubicado en la región `us-east-1` (US East, N. Virginia).
- **Nombre de la regla:** `retencion-sitio`, habilitada a nivel de todo el bucket (Bucket completo).
- **Acciones de la versión actual:**
  - **Día 0:** Los objetos son cargados inicialmente en la clase Estándar.
  - **Día 30:** Los objetos se transfieren automáticamente a la clase **Estándar - Acceso poco frecuente (Standard-IA)**.
  - **Día 365:** Los objetos se transfieren a **Glacier Deep Archive**.
- **Acciones de versiones no actuales (Versionado):**
  - **Día 0:** Los objetos se desactualizan cuando se sube una nueva versión.
  - **Día 90:** Se conservan las 0 versiones no actuales más recientes (todas las demás versiones no actuales se eliminan permanentemente).

## Alternativas consideradas
1. **Almacenamiento permanente en S3 Standard sin regla de ciclo de vida:** Se descartó debido a que mantener archivos estáticos y versiones antiguas en S3 Standard genera costos innecesarios a lo largo del tiempo cuando el acceso a los mismos disminuye considerablemente después de los primeros 30 días.
2. **Transferencia directa a Glacier el día 0:** Se descartó porque Glacier presenta tiempos y costos de recuperación más elevados, lo que impediría el acceso rápido requerido para los objetos de uso cotidiano en el sitio durante su primer mes de vida.

## Consecuencias
### Positivas
- Reducción drástica de costos a largo plazo al migrar de Standard a Standard-IA a los 30 días y a Glacier Deep Archive al año (365 días).
- Limpieza y purga automática de versiones no actuales a los 90 días, optimizando el espacio utilizado.
- Automatización completa del ciclo de vida de los datos sin requerir intervención manual.

### Costos o desventajas que aceptamos
- Las solicitudes de transición entre clases de almacenamiento generan un pequeño costo por operación de AWS.
- El tiempo de recuperación de objetos archivados en Glacier Deep Archive requiere de horas en caso de necesitarse la restauración de un archivo antiguo.

### Que habría que revisar mas adelante
- Analizar los patrones reales de tráfico y acceso al bucket mediante métricas para evaluar si el paso a Standard-IA a los 30 días es óptimo.
- Monitorear el volumen de versiones no actuales generadas para confirmar que la eliminación a los 90 días mantiene controlados los costos.

```
