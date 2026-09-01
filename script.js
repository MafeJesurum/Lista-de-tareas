/**
 * script.js
 *
 * Convención de nombres (Clase 3):
 *  - variables y funciones en camelCase       -> taskList, addTask()
 *  - constantes en MAYUSCULAS_CON_GUION_BAJO  -> STORAGE_KEY
 *  - nombres descriptivos, nada de x, data1, temp...
 */

const STORAGE_KEY = "cuc-demo-tasks";

const taskForm = document.getElementById("taskForm");
const taskModal = document.getElementById("taskModal");
const openTaskModal = document.getElementById("openTaskModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const cancelTask = document.getElementById("cancelTask");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskLabel = document.getElementById("taskLabel");
const taskColor = document.getElementById("taskColor");
const todoList = document.getElementById("todoList");
const progressList = document.getElementById("progressList");
const completedList = document.getElementById("completedList");
const todoCounter = document.getElementById("todoCounter");
const progressCounter = document.getElementById("progressCounter");
const completedCounter = document.getElementById("completedCounter");

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

function openModal() {
  taskModal.classList.add("show");
  taskModal.setAttribute("aria-hidden", "false");
  taskTitle.focus();
}

function closeModal() {
  taskModal.classList.remove("show");
  taskModal.setAttribute("aria-hidden", "true");
  taskForm.reset();
  taskColor.value = "#2f6f4f";
}
/**
 * Agrega una nueva tarea a partir del texto ingresado.
 */
function addTask(taskText) {
  const newTask = {
    id: Date.now(),
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    label: taskLabel.value.trim(),
    color: taskColor.value,
    status: "todo", // Estado inicial de la tarea
  };

  taskList.push(newTask);
  saveTasks();
  renderTasks();
  closeModal();
}

function editTask(taskId) {
  const taskToEdit = taskList.find((item) => item.id === taskId);
  if (!task) {
    return
  }

  const newTitle = prompt("Editar título de la tarea:", taskToEdit.title);
  if (newTitle === null) {
    return; // El usuario canceló la edición
  }
  const newDescription = prompt("Editar descripción de la tarea:", taskToEdit.description);
  if (newTitle.trim() === "") {
    alert("El título no puede estar vacío.");
    return;
  }

  taskToEdit.title = newTitle.trim();
  taskToEdit.description = newDescription ? newDescription.trim() : "";
  saveTasks();
  renderTasks();
}


function createTaskElement(task) {
  const card= document.createElement("article");
  card.className = "task-card";
  card.dataset.id = task.id;

  const title = document.createElement("h3");
  title.textContent = task.title;

  const description = document.createElement("p");
  description.textContent = task.description || "sin descripción";
  
  const label = document.createElement("span");
  label.className = "task-label";
  label.textContent = task.label;
  label.style.backgroundColor = task.color;

  const actions = document.createElement("div");
  actions.className= "task-card-actions";

  const editButton= document.createElement("button");
  editButton.type= "button";
  editButton.className = "edit-task";
  editButton.textContent = "Editar";
  editButton.addEventListener("click", () => editTask(task.id));

  actions.appendChild(editButton);
  card.appendChild(title, description, label, actions);

  return card;
}

function renderTasks() {
  todoList.innerHTML = "";
  progressList.innerHTML = "";
  completedList.innerHTML = "";

  let todoCount = 0;
  let progressCount = 0;
  let completedCount = 0;

  taskList.forEach((task) => {
    const card = createTaskElement(task);
    if (task.status === "todo") {
      todoList.appendChild(card);
      todoCount++;
    } else if (task.status === "progress") {
      progressList.appendChild(card);
      progressCount++;
    } else if (task.status === "completed") {
      completedList.appendChild(card);
      completedCount++;
    }
    });

  todoCounter.textContent = todoCount;
  progressCounter.textContent = progressCount;
  completedCounter.textContent = completedCount;
}

openTaskModal.addEventListener("click", openModal);
closeTaskModal.addEventListener("click", closeModal);
cancelTask.addEventListener("click", closeModal);

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

renderTasks();