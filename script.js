/**
 * script.js
 *
 * Convención de nombres (Clase 3):
 *  - variables y funciones en camelCase       -> taskList, addTask()
 *  - constantes en MAYUSCULAS_CON_GUION_BAJO  -> STORAGE_KEY
 *  - nombres descriptivos, nada de x, data1, temp...
 */

const STORAGE_KEY = "cuc-demo-tasks";

const taskForm        = document.getElementById("taskForm");
const taskModal       = document.getElementById("taskModal");
const openTaskModal   = document.getElementById("openTaskModal");
const closeTaskModal  = document.getElementById("closeTaskModal");
const cancelTask      = document.getElementById("cancelTask");
const taskTitle       = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskLabel       = document.getElementById("taskLabel");
const taskColor       = document.getElementById("taskColor");
const taskListEl      = document.getElementById("taskList");
const taskCounter     = document.getElementById("taskCounter");
const emptyState      = document.getElementById("emptyState");

let editingTaskId = null;
let tasks = loadTasks();

/**
 * Lee las tareas guardadas en localStorage.
 * Si no hay nada guardado, devuelve una lista vacía.
 */
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Guarda la lista de tareas actual en localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function openModal(task = null) {
  taskModal.classList.add("show");
  taskModal.setAttribute("aria-hidden", "false");
  if (task) {
    editingTaskId = task.id;
    document.getElementById("TaskModalTitle").textContent = "Editar Tarea";
    taskTitle.value       = task.title;
    taskDescription.value = task.description;
    taskLabel.value       = task.label;
    taskColor.value       = task.color;
  } else {
    editingTaskId = null;
    document.getElementById("TaskModalTitle").textContent = "Agregar Tarea";
    taskForm.reset();
    taskColor.value = "#2f6f4f";
  }
  taskTitle.focus();
}

function closeModal() {
  taskModal.classList.remove("show");
  taskModal.setAttribute("aria-hidden", "true");
  taskForm.reset();
  taskColor.value = "#2f6f4f";
  editingTaskId = null;
}

/**
 * Agrega una nueva tarea a partir de los valores del modal.
 */
function addTask() {
  const newTask = {
    id:          Date.now(),
    title:       taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    label:       taskLabel.value.trim(),
    color:       taskColor.value,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  closeModal();
}

function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) openModal(task);
}

function deleteTask(taskId) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
  renderTasks();
}

function createTaskElement(task) {
  const card = document.createElement("article");
  card.className  = "task-card";
  card.dataset.id = task.id;

  const title = document.createElement("h3");
  title.textContent = task.title;

  const description = document.createElement("p");
  description.textContent = task.description || "Sin descripción";

  const label = document.createElement("span");
  label.className = "task-label";
  label.textContent = task.label;
  label.style.backgroundColor = task.color;

  const actions = document.createElement("div");
  actions.className = "task-card-actions";

  const editButton = document.createElement("button");
  editButton.type      = "button";
  editButton.className = "edit-task";
  editButton.textContent = "Editar";
  editButton.addEventListener("click", () => editTask(task.id));

  const deleteButton = document.createElement("button");
  deleteButton.type      = "button";
  deleteButton.className = "delete-task";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  actions.append(editButton, deleteButton);
  card.append(title, description, label, actions);

  return card;
}

function renderTasks() {
  taskListEl.innerHTML = "";

  tasks.forEach((task) => {
    taskListEl.appendChild(createTaskElement(task));
  });

  taskCounter.textContent = tasks.length;
  emptyState.style.display = tasks.length === 0 ? "block" : "none";
}

openTaskModal.addEventListener("click", () => openModal());
closeTaskModal.addEventListener("click", closeModal);
cancelTask.addEventListener("click", closeModal);

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();
  if (!title) {
    alert("El título de la tarea no puede estar vacío.");
    return;
  }

  if (editingTaskId !== null) {
    const task = tasks.find((t) => t.id === editingTaskId);
    if (task) {
      task.title       = title;
      task.description = taskDescription.value.trim();
      task.label       = taskLabel.value.trim();
      task.color       = taskColor.value;
    }
    saveTasks();
    renderTasks();
    closeModal();
  } else {
    addTask();
  }
});

renderTasks();
