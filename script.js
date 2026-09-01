/**
 * script.js
 *
 * Convención de nombres (Clase 3):
 *  - variables y funciones en camelCase       -> tasks, addTask()
 *  - constantes en MAYUSCULAS_CON_GUION_BAJO  -> PRESET_COLORS
 *  - nombres descriptivos, nada de x, data1, temp...
 */

//Constantes

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskListElement = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const emptyState = document.getElementById("emptyState");

let taskList = loadTasks();

/**
 * Lee las tareas guardadas en localStorage.
 * Si no hay nada guardado, devuelve una lista vacía.
 */
function loadTasks() {
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
}

/**
 * Guarda la lista de tareas actual en localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
}

/**
 * Agrega una nueva tarea a partir del texto ingresado.
 */
function addTask(taskText) {
  const newTask = {
    id: Date.now(),
    text: taskText.trim(),
    done: false,
  };

  taskList.push(newTask);
  saveTasks();
  renderTasks();
}

/**
 * Cambia el estado (completada / pendiente) de una tarea.
 */
function toggleTaskDone(taskId) {
  taskList = taskList.map((task) =>
    task.id === taskId ? { ...task, done: !task.done } : task
  );
  saveTasks();
  renderTasks();
}

/**
 * Elimina una tarea de la lista.
 */
function deleteTask(taskId) {
  taskList = taskList.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

/**
 * Crea el elemento <li> correspondiente a una tarea.
 */
function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = task.done ? "task-item task-item-done" : "task-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-item-checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTaskDone(task.id));

  const label = document.createElement("span");
  label.className = "task-item-label";
  label.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "task-item-delete";
  deleteButton.setAttribute("aria-label", "Eliminar tarea");
  deleteButton.textContent = "✕";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  item.append(checkbox, label, deleteButton);
  return item;
}

/**
 * Vuelve a dibujar la lista completa de tareas en pantalla.
 */
function renderTasks() {
  taskListElement.innerHTML = "";

  taskList.forEach((task) => {
    taskListElement.appendChild(createTaskElement(task));
  });

  const pendingCount = taskList.filter((task) => !task.done).length;
  taskCounter.textContent = `${pendingCount} tarea${pendingCount === 1 ? "" : "s"}`;

  emptyState.style.display = taskList.length === 0 ? "block" : "none";
}

function openDeleteColumnModal(col) {
  const colTasks = tasks.filter((t) => t.column === col.id);

  const taskText = taskInput.value;
  if (!taskText.trim()) return;

  addTask(taskText);
  taskInput.value = "";
  taskInput.focus();
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
