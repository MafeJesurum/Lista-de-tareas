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

const DEFAULT_TASK_COLOR = "#2f6f4f";

//Estado inicial

let columns = [
  { id: "todo",        name: "Por Hacer",   color: null },
  { id: "in-progress", name: "En Progreso", color: null },
  { id: "done",        name: "Completadas", color: null },
];

let tasks = [
  { id: 1, title: "Definir estructura del proyecto",        description: "",                          label: "",        color: DEFAULT_TASK_COLOR, column: "done"        },
  { id: 2, title: "Crear tablero HTML y CSS base",          description: "",                          label: "",        color: DEFAULT_TASK_COLOR, column: "done"        },
  { id: 3, title: "Implementar drag & drop entre columnas", description: "Usar la API nativa de HTML5", label: "técnico", color: "#2563eb",          column: "in-progress" },
  { id: 4, title: "Conectar repositorio a Netlify",         description: "",                          label: "deploy",  color: DEFAULT_TASK_COLOR, column: "in-progress" },
  { id: 5, title: "Escribir pruebas de integración",        description: "",                          label: "",        color: DEFAULT_TASK_COLOR, column: "todo"        },
  { id: 6, title: "Revisar accesibilidad del tablero",      description: "",                          label: "a11y",    color: "#7c3aed",          column: "todo"        },
  { id: 7, title: "Documentar convenciones del equipo",     description: "",                          label: "",        color: DEFAULT_TASK_COLOR, column: "todo"        },
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

  const top = document.createElement("div");
  top.className = "task-item-top";

  const titleEl = document.createElement("span");
  titleEl.className = "task-item-title";
  titleEl.textContent = task.title;

  const actions = document.createElement("div");
  actions.className = "task-item-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "task-item-edit";
  editButton.setAttribute("aria-label", "Editar tarea");
  editButton.textContent = "✎";
  editButton.addEventListener("click", () => openEditTaskModal(task));

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "task-item-delete";
  deleteButton.setAttribute("aria-label", "Eliminar tarea");
  deleteButton.textContent = "✕";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actions.append(editButton, deleteButton);
  top.append(titleEl, actions);
  item.appendChild(top);

  if (task.description) {
    const desc = document.createElement("p");
    desc.className = "task-item-desc";
    desc.textContent = task.description;
    item.appendChild(desc);
  }

  if (task.label) {
    const tag = document.createElement("span");
    tag.className = "task-item-tag";
    tag.textContent = task.label;
    tag.style.backgroundColor = task.color || DEFAULT_TASK_COLOR;
    item.appendChild(tag);
  }

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

  const addBtn = document.createElement("button");
  addBtn.className = "btn-add-column";
  addBtn.textContent = "+ Añadir columna";
  addBtn.addEventListener("click", addColumn);
  board.appendChild(addBtn);
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

  const colorLabel = document.createElement("p");
  colorLabel.className = "dropdown-label";
  colorLabel.textContent = "Color de fondo";

  const swatchRow = buildSwatchRow(col.color, (value) => {
    setColumnColor(col.id, value);
    closeActiveDropdown();
  });

  dropdown.append(editBtn, colorLabel, swatchRow, sep, deleteBtn);

  const rect = menuBtn.getBoundingClientRect();
  dropdown.style.top   = `${rect.bottom + 6}px`;
  dropdown.style.right = `${window.innerWidth - rect.right}px`;

  document.body.appendChild(dropdown);
  activeDropdown = dropdown;
}

function buildSwatchRow(activeColor, onSelect) {
  const row = document.createElement("div");
  row.className = "swatch-row";

  PRESET_COLORS.forEach(({ label, value }) => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "swatch" + (activeColor === value ? " swatch-active" : "");
    swatch.title = label;
    swatch.style.background = value || "#fff";
    if (!value) swatch.textContent = "✕";
    swatch.addEventListener("click", () => {
      row.querySelectorAll(".swatch").forEach((s) =>
        s.classList.toggle("swatch-active", s === swatch)
      );
      onSelect(value);
    });
    row.appendChild(swatch);
  });

  return row;
}

function setColumnColor(colId, color) {
  columns = columns.map((c) =>
    c.id === colId ? { ...c, color } : c
  );
  renderBoard();
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

//Modales

function openModal(modalEl) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.appendChild(modalEl);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.body.appendChild(overlay);
}

function closeModal() {
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.remove();
}

function buildTaskModal({ modalTitle, task, onSave }) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.addEventListener("click", (e) => e.stopPropagation());

  const titleEl = document.createElement("h3");
  titleEl.className = "modal-title";
  titleEl.textContent = modalTitle;

  const body = document.createElement("div");
  body.className = "modal-body";

  const titleLabel = document.createElement("label");
  titleLabel.className = "modal-label";
  titleLabel.textContent = "Título *";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className = "modal-input";
  titleInput.placeholder = "¿Qué hay que hacer?";
  titleInput.maxLength = 120;
  titleInput.required = true;
  titleInput.value = task ? task.title : "";

  const descLabel = document.createElement("label");
  descLabel.className = "modal-label";
  descLabel.textContent = "Descripción";

  const descInput = document.createElement("textarea");
  descInput.className = "modal-input modal-textarea";
  descInput.placeholder = "Detalles opcionales...";
  descInput.rows = 3;
  descInput.value = task ? task.description : "";

  const labelLabel = document.createElement("label");
  labelLabel.className = "modal-label";
  labelLabel.textContent = "Etiqueta";

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.className = "modal-input";
  labelInput.placeholder = "Ej. urgente, técnico...";
  labelInput.maxLength = 30;
  labelInput.value = task ? task.label : "";

  const colorLabel = document.createElement("label");
  colorLabel.className = "modal-label";
  colorLabel.textContent = "Color de etiqueta";

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.className = "modal-color";
  colorInput.value = task ? task.color : DEFAULT_TASK_COLOR;

  body.append(titleLabel, titleInput, descLabel, descInput, labelLabel, labelInput, colorLabel, colorInput);

  if (!task) {
    const colLabel = document.createElement("label");
    colLabel.className = "modal-label";
    colLabel.textContent = "Columna";

    const colSelect = document.createElement("select");
    colSelect.className = "modal-input";
    columns.forEach((col) => {
      const opt = document.createElement("option");
      opt.value = col.id;
      opt.textContent = col.name;
      colSelect.appendChild(opt);
    });

    body.append(colLabel, colSelect);

    const footer = document.createElement("div");
    footer.className = "modal-footer";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn-secondary";
    cancelBtn.textContent = "Cancelar";
    cancelBtn.addEventListener("click", closeModal);

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn-primary";
    saveBtn.textContent = "Guardar";
    saveBtn.addEventListener("click", () => {
      const title = titleInput.value.trim();
      if (!title) { titleInput.focus(); return; }
      onSave({
        title,
        description: descInput.value.trim(),
        label:       labelInput.value.trim(),
        color:       colorInput.value,
        column:      colSelect.value,
      });
    });

    titleInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveBtn.click();
    });

    footer.append(cancelBtn, saveBtn);
    modal.append(titleEl, body, footer);
    openModal(modal);
    setTimeout(() => titleInput.focus(), 0);
    return;
  }

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn-secondary";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.addEventListener("click", closeModal);

  const saveBtn = document.createElement("button");
  saveBtn.type = "button";
  saveBtn.className = "btn-primary";
  saveBtn.textContent = "Guardar";
  saveBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    if (!title) { titleInput.focus(); return; }
    onSave({
      title,
      description: descInput.value.trim(),
      label:       labelInput.value.trim(),
      color:       colorInput.value,
    });
  });

  titleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveBtn.click();
  });

  footer.append(cancelBtn, saveBtn);
  modal.append(titleEl, body, footer);
  openModal(modal);
  setTimeout(() => titleInput.focus(), 0);
}

function openCreateTaskModal() {
  if (columns.length === 0) return;
  buildTaskModal({
    modalTitle: "Agregar tarea",
    task: null,
    onSave: ({ title, description, label, color, column }) => {
      tasks.push({ id: nextTaskId++, title, description, label, color, column });
      renderBoard();
      closeModal();
    },
  });
}

function openEditTaskModal(task) {
  buildTaskModal({
    modalTitle: "Editar tarea",
    task,
    onSave: ({ title, description, label, color }) => {
      tasks = tasks.map((t) =>
        t.id === task.id ? { ...t, title, description, label, color } : t
      );
      renderBoard();
      closeModal();
    },
  });
}

function openAddColumnModal() {
  let selectedColor = null;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.addEventListener("click", (e) => e.stopPropagation());

  const title = document.createElement("h3");
  title.className = "modal-title";
  title.textContent = "Nueva columna";

  const body = document.createElement("div");
  body.className = "modal-body";

  const nameLabel = document.createElement("label");
  nameLabel.className = "modal-label";
  nameLabel.textContent = "Nombre";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "modal-input";
  nameInput.placeholder = "Ej: Revisión, Bloqueadas...";
  nameInput.maxLength = 40;

  const colorLabel = document.createElement("span");
  colorLabel.className = "modal-label";
  colorLabel.textContent = "Color de fondo";

  const swatchRow = buildSwatchRow(null, (value) => {
    selectedColor = value;
  });

  body.append(nameLabel, nameInput, colorLabel, swatchRow);

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn-secondary";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.addEventListener("click", closeModal);

  const createBtn = document.createElement("button");
  createBtn.type = "button";
  createBtn.className = "btn-primary";
  createBtn.textContent = "Crear columna";
  createBtn.addEventListener("click", () => {
    const name = nameInput.value.trim() || "Nueva columna";
    const colId = `c${nextColId++}`;
    columns.push({ id: colId, name, color: selectedColor });
    renderBoard();
    closeModal();
  });

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") createBtn.click();
  });

  footer.append(cancelBtn, createBtn);
  modal.append(title, body, footer);
  openModal(modal);
  setTimeout(() => nameInput.focus(), 0);
}

function addColumn() {
  openAddColumnModal();
}

function openDeleteColumnModal(col) {
  const colTasks = tasks.filter((t) => t.column === col.id);

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.addEventListener("click", (e) => e.stopPropagation());

  const title = document.createElement("h3");
  title.className = "modal-title";
  title.textContent = "Eliminar columna";

  const body = document.createElement("div");
  body.className = "modal-body";

  const msg = document.createElement("p");
  msg.className = "modal-text";
  msg.innerHTML =
    colTasks.length > 0
      ? `La columna <strong>"${col.name}"</strong> tiene ${colTasks.length} tarea(s). Si la eliminas, esas tareas también se perderán. Esta acción no se puede deshacer.`
      : `¿Eliminar la columna <strong>"${col.name}"</strong>? Esta acción no se puede deshacer.`;

  body.appendChild(msg);

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn-secondary";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.addEventListener("click", closeModal);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn-danger";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.column !== col.id);
    columns = columns.filter((c) => c.id !== col.id);
    renderBoard();
    closeModal();
  });

  footer.append(cancelBtn, deleteBtn);
  modal.append(title, body, footer);
  openModal(modal);
}

function deleteColumn(colId) {
  const col = columns.find((c) => c.id === colId);
  if (col) openDeleteColumnModal(col);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

//Operaciones sobre tareas

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  renderBoard();
}

//Botón de agregar tarea

document.getElementById("addTaskBtn").addEventListener("click", openCreateTaskModal);

//Arranque

renderBoard();
