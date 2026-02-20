const STORAGE_KEY = "devops_dashboard_tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");



function loadTasks(){
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveTasks(tasks){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const label = taskInput.value.trim();
  if (label) {
    tasks.push({ id: Date.now(), label, done: false });
    saveTasks(tasks);
    taskInput.value = "";
    render();
  }
});

function render(){
  taskList.innerHTML = "";

  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");

    const left = document.createElement("div");
    left.className = "item-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.done;
    checkbox.addEventListener("change", () => {
      t.done = checkbox.checked;
      saveTasks(tasks);
      render();
    });

    const text = document.createElement("span");
    text.textContent = t.label;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = t.done ? "faite" : "à faire";

    left.appendChild(checkbox);
    left.appendChild(text);
    left.appendChild(badge);

    const del = document.createElement("button");
    del.className = "icon-btn";
    del.textContent = "🗑️";
    del.title = "Supprimer";
    del.addEventListener("click", () => {
      tasks = tasks.filter(x => x.id !== t.id);
      saveTasks(tasks);
      render();
    });

    li.appendChild(left);
    li.appendChild(del);
    taskList.appendChild(li);
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  totalCount.textContent = String(total);
  doneCount.textContent = String(done);
}

render();
