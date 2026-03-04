const STORAGE_KEY = "devops_dashboard_tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const toggleTheme = document.getElementById("toggleTheme");
const canvas = document.getElementById("progressCanvas");
const ctx = canvas.getContext("2d");
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
  drawChart(done, total);
}
//fonction pour le thème

function initTheme(){
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeButton(saved);
}

function updateThemeButton(theme) {
  toggleTheme.textContent = theme === "dark" ? "☀️ Thème" : "🌙 Thème";
}

toggleTheme.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeButton(next);
  render();
});

function drawChart(done, total){
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // donut geometry
  const cx = w/2;
  const cy = h/2;
  const r = Math.min(w,h)*0.35;
  const thickness = r*0.4;

  const pct = total === 0 ? 0 : done/total;

  // round line caps for smoother appearance
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // track (muted color, thinner)
  ctx.strokeStyle = getComputedStyle(document.documentElement)
                    .getPropertyValue('--muted') || '#888';
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.lineWidth = thickness;
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.stroke();

  // progress (accent color, brighter)
  ctx.strokeStyle = getComputedStyle(document.documentElement)
                    .getPropertyValue('--accent') || '#6ea8fe';
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.lineWidth = thickness;
  ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + Math.PI*2*pct);
  ctx.stroke();

  // text (primary text color)
  ctx.fillStyle = getComputedStyle(document.documentElement)
                    .getPropertyValue('--text') || '#000';
  
  // percentage text - larger and centered
  ctx.font = "bold 48px system-ui";
  const percentText = `${Math.round(pct*100)}%`;
  const percentMetrics = ctx.measureText(percentText);
  ctx.fillText(percentText, cx - percentMetrics.width/2, cy - 5);
  
  // label text - smaller and centered
  ctx.font = "14px system-ui";
  ctx.globalAlpha = 0.8;
  const labelText = "tâches faites";
  const labelMetrics = ctx.measureText(labelText);
  ctx.fillText(labelText, cx - labelMetrics.width/2, cy + 28);
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const label = taskInput.value.trim();
  if (!label) return;

  tasks.unshift({
    id: crypto.randomUUID(),
    label,
    done: false
  });

  taskInput.value = "";
  saveTasks(tasks);
  render();
});
initTheme();

render();
