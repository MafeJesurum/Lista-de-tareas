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

let nextTaskId     = 8;
let nextColId      = 1;
let draggedTaskId  = null;
let activeDropdown = null;

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

  item.draggable = true;

  item.addEventListener("dragstart", (e) => {
    draggedTaskId = task.id;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => item.classList.add("dragging"), 0);
  });

  item.addEventListener("dragend", () => {
    draggedTaskId = null;
    item.classList.remove("dragging");
  });

  return item;
}

//Renderizado

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  columns.forEach((col) => board.appendChild(createColumnElement(col)));
}

function createColumnElement(col) {
  const colEl = document.createElement("div");
  colEl.className = "column";
  colEl.id = `col-${col.id}`;
  colEl.dataset.column = col.id;
  if (col.color) colEl.style.backgroundColor = col.color;

  const header = document.createElement("div");
  header.className = "column-header";

  const title = document.createElement("h2");
  title.className = "column-title";
  title.textContent = col.name;

  const counter = document.createElement("span");
  counter.className = "column-counter";
  counter.textContent = tasks.filter((t) => t.column === col.id).length;

  const rightSide = document.createElement("div");
  rightSide.className = "column-header-right";

  const menuBtn = document.createElement("button");
  menuBtn.type = "button";
  menuBtn.className = "btn-column-menu";
  menuBtn.setAttribute("aria-label", "Opciones de columna");
  menuBtn.textContent = "⋯";
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openColumnMenu(col, colEl, menuBtn);
  });

  rightSide.append(counter, menuBtn);
  header.append(title, rightSide);

  const list = document.createElement("ul");
  list.className = "task-list";
  tasks
    .filter((t) => t.column === col.id)
    .forEach((task) => list.appendChild(createTaskElement(task)));

  let dragCounter = 0;

  colEl.addEventListener("dragenter", (e) => {
    e.preventDefault();
    dragCounter++;
    colEl.classList.add("drag-over");
  });

  colEl.addEventListener("dragleave", () => {
    dragCounter--;
    if (dragCounter === 0) colEl.classList.remove("drag-over");
  });

  colEl.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  colEl.addEventListener("drop", (e) => {
    e.preventDefault();
    dragCounter = 0;
    colEl.classList.remove("drag-over");
    if (draggedTaskId === null) return;
    tasks = tasks.map((t) =>
      t.id === draggedTaskId ? { ...t, column: col.id } : t
    );
    renderBoard();
  });

  colEl.append(header, list);
  return colEl;
}

//Menú de columna

function openColumnMenu(col, colEl, menuBtn) {
  closeActiveDropdown();

  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  dropdown.addEventListener("click", (e) => e.stopPropagation());

  const editBtn = document.createElement("button");
  editBtn.className = "dropdown-item";
  editBtn.textContent = "Editar nombre";
  editBtn.addEventListener("click", () => {
    closeActiveDropdown();
    startRenameColumn(col, colEl);
  });

  const sep = document.createElement("hr");
  sep.className = "dropdown-sep";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "dropdown-item dropdown-item-danger";
  deleteBtn.textContent = "Eliminar columna";
  deleteBtn.addEventListener("click", () => {
    closeActiveDropdown();
    deleteColumn(col.id);
  });

  dropdown.append(editBtn, sep, deleteBtn);

  const rect = menuBtn.getBoundingClientRect();
  dropdown.style.top   = `${rect.bottom + 6}px`;
  dropdown.style.right = `${window.innerWidth - rect.right}px`;

  document.body.appendChild(dropdown);
  activeDropdown = dropdown;
}

function startRenameColumn(col, colEl) {
  const titleEl = colEl.querySelector(".column-title");
  if (!titleEl) return;

  const input = document.createElement("input");
  input.type = "text";
  input.className = "column-title-input";
  input.value = col.name;
  titleEl.replaceWith(input);
  input.focus();
  input.select();

  let committed = false;

  function commit() {
    if (committed) return;
    committed = true;
    renameColumn(col.id, input.value);
  }

  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter")  { e.preventDefault(); commit(); }
    if (e.key === "Escape") { committed = true; renderBoard(); }
  });
}

function renameColumn(colId, newName) {
  const trimmed = newName.trim();
  if (trimmed) {
    columns = columns.map((c) =>
      c.id === colId ? { ...c, name: trimmed } : c
    );
  }
  renderBoard();
}

function closeActiveDropdown() {
  if (activeDropdown) {
    activeDropdown.remove();
    activeDropdown = null;
  }
}

document.addEventListener("click", closeActiveDropdown);

//Operaciones sobre tareas

function addTask(text) {
  if (columns.length === 0) return;
  tasks.push({ id: nextTaskId++, text: text.trim(), column: columns[0].id });
  renderBoard();
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  renderBoard();
}

//Formulario de nueva tarea

const taskForm  = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value;
  if (!text.trim()) return;
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

//Arranque

renderBoard();
