import { leerDatos, guardarDatos } from './almacenamiento.js';

const COLUMNAS_INICIALES = [
  { id: 'todo', name: 'Por Hacer', color: null },
  { id: 'in-progress', name: 'En Progreso', color: null },
  { id: 'done', name: 'Completadas', color: null }
];

export const obtenerColumnas = () => leerDatos('columnas', COLUMNAS_INICIALES);
export const guardarColumnas = (columnas) => guardarDatos('columnas', columnas);
export const obtenerTareas = () => leerDatos('tareas', []);
export const guardarTareas = (tareas) => guardarDatos('tareas', tareas);