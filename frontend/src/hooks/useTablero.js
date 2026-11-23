import { useEffect, useState } from 'react';
import { api } from '../servicios/api.js';

const reemplazar = (lista, actualizado) =>
  lista.map((item) => (item.id === actualizado.id ? actualizado : item));

export function useTablero() {
  const [columnas, setColumnas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      try {
        const [columnasIniciales, tareasIniciales] = await Promise.all([
          api.obtenerColumnas(),
          api.obtenerTareas(),
        ]);
        setColumnas(columnasIniciales);
        setTareas(tareasIniciales);
      } catch (e) {
        setError(`No se pudo cargar el tablero: ${e.message}`);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function conManejoDeError(accion) {
    return async (...argumentos) => {
      try {
        setError(null);
        await accion(...argumentos);
        return true;
      } catch (e) {
        setError(e.message);
        return false;
      }
    };
  }

  return {
    columnas,
    tareas,
    cargando,
    error,
    cerrarError: () => setError(null),

    crearTarea: conManejoDeError(async (datos) => {
      const nueva = await api.crearTarea(datos);
      setTareas((previas) => [...previas, nueva]);
    }),
    editarTarea: conManejoDeError(async (id, cambios) => {
      const actualizada = await api.editarTarea(id, cambios);
      setTareas((previas) => reemplazar(previas, actualizada));
    }),
    moverTarea: conManejoDeError(async (id, idColumna) => {
      const actualizada = await api.editarTarea(id, { column: idColumna });
      setTareas((previas) => reemplazar(previas, actualizada));
    }),
    eliminarTarea: conManejoDeError(async (id) => {
      await api.eliminarTarea(id);
      setTareas((previas) => previas.filter((t) => t.id !== id));
    }),

    crearColumna: conManejoDeError(async (datos) => {
      const nueva = await api.crearColumna(datos);
      setColumnas((previas) => [...previas, nueva]);
    }),
    editarColumna: conManejoDeError(async (id, cambios) => {
      const actualizada = await api.editarColumna(id, cambios);
      setColumnas((previas) => reemplazar(previas, actualizada));
    }),
    eliminarColumna: conManejoDeError(async (id) => {
      await api.eliminarColumna(id);
      setColumnas((previas) => previas.filter((c) => c.id !== id));
      setTareas((previas) => previas.filter((t) => t.column !== id));
    }),
  };
}
