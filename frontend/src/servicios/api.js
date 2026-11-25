import * as apiDePrueba from './apiDePrueba.js';

const URL_API = import.meta.env.VITE_API_URL;
const USAR_DATOS_PRUEBA = import.meta.env.VITE_USAR_DATOS_PRUEBA === 'true';

const SIN_CONTENIDO = 204;

async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    method: metodo,
    headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });

  if (respuesta.status === SIN_CONTENIDO) return null;

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new Error(datos?.error || `Error ${respuesta.status}`);
  }
  return datos;
}

const apiReal = {
  obtenerColumnas: () => pedir('/columnas'),
  crearColumna: (columna) => pedir('/columnas', { metodo: 'POST', cuerpo: columna }),
  editarColumna: (id, cambios) => pedir(`/columnas/${id}`, { metodo: 'PATCH', cuerpo: cambios }),
  eliminarColumna: (id) => pedir(`/columnas/${id}`, { metodo: 'DELETE' }),

  obtenerTareas: () => pedir('/tareas'),
  crearTarea: (tarea) => pedir('/tareas', { metodo: 'POST', cuerpo: tarea }),
  editarTarea: (id, cambios) => pedir(`/tareas/${id}`, { metodo: 'PATCH', cuerpo: cambios }),
  eliminarTarea: (id) => pedir(`/tareas/${id}`, { metodo: 'DELETE' }),
};

export const api = USAR_DATOS_PRUEBA ? apiDePrueba : apiReal;
