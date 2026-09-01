/**
 * script.js
 *
 * Convención de nombres (Clase 3):
 *  - variables y funciones en camelCase       -> tasks, addTask()
 *  - constantes en MAYUSCULAS_CON_GUION_BAJO  -> PRESET_COLORS
 *  - nombres descriptivos, nada de x, data1, temp...
 */

//Constantes

const PRESET_COLORS = [
  { label: "Sin color", value: null      },
  { label: "Azul",      value: "#dbeafe" },
  { label: "Verde",     value: "#dcfce7" },
  { label: "Amarillo",  value: "#fef9c3" },
  { label: "Rosa",      value: "#fce7f3" },
  { label: "Naranja",   value: "#ffedd5" },
  { label: "Morado",    value: "#ede9fe" },
];

//Estado inicial

let columns = [
  { id: "todo",        name: "Por Hacer",   color: null },
  { id: "in-progress", name: "En Progreso", color: null },
  { id: "done",        name: "Completadas", color: null },
];

let tasks = [
  { id: 1, text: "Definir estructura del proyecto",        column: "done"        },
  { id: 2, text: "Crear tablero HTML y CSS base",          column: "done"        },
  { id: 3, text: "Implementar drag & drop entre columnas", column: "in-progress" },
  { id: 4, text: "Conectar repositorio a Netlify",         column: "in-progress" },
  { id: 5, text: "Escribir pruebas de integración",        column: "todo"        },
  { id: 6, text: "Revisar accesibilidad del tablero",      column: "todo"        },
  { id: 7, text: "Documentar convenciones del equipo",     column: "todo"        },
];

let nextTaskId = 8;
let nextColId  = 1;

//Tarjetas

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = "task-item";
  item.dataset.taskId = String(task.id);

  const label = document.createElement("span");
  label.className = "task-item-label";
  label.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "task-item-delete";
  deleteButton.setAttribute("aria-label", "Eliminar tarea");
  deleteButton.textContent = "✕";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  item.append(label, deleteButton);
  return item;
}
