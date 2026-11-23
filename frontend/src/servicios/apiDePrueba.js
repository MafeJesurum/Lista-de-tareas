// Archivo de pruebas nada más

let columnas = [
  { id: 'todo', name: 'Por Hacer', color: null },
  { id: 'in-progress', name: 'En Progreso', color: null },
  { id: 'done', name: 'Completadas', color: null },
];

let tareas = [
  { id: 1, title: 'Definir estructura del proyecto', description: '', label: '', color: '#2f6f4f', column: 'done' },
  { id: 2, title: 'Implementar drag & drop', description: 'Usar la API nativa de HTML5', label: 'técnico', color: '#2563eb', column: 'in-progress' },
  { id: 3, title: 'Escribir pruebas', description: '', label: '', color: '#2f6f4f', column: 'todo' },
];

let siguienteTarea = 4;
let siguienteColumna = 4;

const copia = (valor) => Promise.resolve(structuredClone(valor));

export const obtenerColumnas = () => copia(columnas);

export function crearColumna(datos) {
  const nueva = { id: `col-${siguienteColumna++}`, ...datos };
  columnas.push(nueva);
  return copia(nueva);
}

export function editarColumna(id, cambios) {
  columnas = columnas.map((c) => (c.id === id ? { ...c, ...cambios } : c));
  return copia(columnas.find((c) => c.id === id));
}

export function eliminarColumna(id) {
  columnas = columnas.filter((c) => c.id !== id);
  tareas = tareas.filter((t) => t.column !== id);
  return Promise.resolve(null);
}

export const obtenerTareas = () => copia(tareas);

export function crearTarea(datos) {
  const nueva = { id: siguienteTarea++, ...datos };
  tareas.push(nueva);
  return copia(nueva);
}

export function editarTarea(id, cambios) {
  tareas = tareas.map((t) => (t.id === id ? { ...t, ...cambios } : t));
  return copia(tareas.find((t) => t.id === id));
}

export function eliminarTarea(id) {
  tareas = tareas.filter((t) => t.id !== id);
  return Promise.resolve(null);
}
