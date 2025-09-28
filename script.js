document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskList = document.getElementById("taskList");
  const toggleTheme = document.getElementById("toggleTheme");

  let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

  const saveTasks = () => localStorage.setItem("studyTasks", JSON.stringify(tasks));

  const renderTasks = () => {
    taskList.innerHTML = "";
    const now = new Date();

    tasks.forEach((task, index) => {
      const deadline = new Date(task.deadline);
      const totalTime = deadline - new Date(task.createdAt);
      const timeLeft = deadline - now;
      const progress = Math.max(0, Math.min(100, 100 - (timeLeft / totalTime) * 100));

      const card = document.createElement("div");
      card.className = "col-md-6 animate__animated animate__fadeInUp";
      card.innerHTML = `
        <div class="card ${task.completed ? 'completed' : ''}">
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">Deadline: ${deadline.toLocaleString()}</p>
            <div class="progress mb-2">
              <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <button class="btn btn-success btn-sm me-2" onclick="toggleComplete(${index})">
              ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Delete</button>
          </div>
        </div>
      `;
      taskList.appendChild(card);

      if (timeLeft > 0 && timeLeft < 60000 && !task.completed) {
        alert(`⏰ Reminder: "${task.title}" is due within a minute!`);
      }
    });
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value;
    const deadline = document.getElementById("taskDeadline").value;
    tasks.push({ title, deadline, completed: false, createdAt: new Date().toISOString() });
    saveTasks();
    renderTasks();
    taskForm.reset();
  });

  window.toggleComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
  });

  renderTasks();
});
