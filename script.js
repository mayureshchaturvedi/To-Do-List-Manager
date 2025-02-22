document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const authContainer = document.getElementById('authContainer');
  const appContainer = document.getElementById('appContainer');
  const authButton = document.getElementById('authButton');
  const toggleAuthLink = document.getElementById('toggleAuthLink');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const addTaskButton = document.getElementById('addTaskButton');
  const filterTasksButton = document.getElementById('filterTasksButton');
  const taskItems = document.getElementById('taskItems');
  const logoutButton = document.getElementById('logoutButton');
  const taskDateInput = document.getElementById('taskDate');
  const filterDateInput = document.getElementById('filterDate');

  let isRegistering = false;

  toggleAuthLink.addEventListener('click', () => {
    isRegistering = !isRegistering;
    document.getElementById('authTitle').textContent = isRegistering ? 'Register' : 'Login';
    authButton.textContent = isRegistering ? 'Register' : 'Login';
    toggleAuthLink.textContent = isRegistering ? 'Already have an account? Login' : "Don't have an account? Register";
  });

  authButton.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const endpoint = isRegistering ? '/register' : '/login';

    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      if (!isRegistering) {
        localStorage.setItem('token', data.token);
        authContainer.classList.add('d-none');
        appContainer.classList.remove('d-none');
        loadTasks();
      } else {
        alert('Registration successful! Please log in.');
      }
    } else {
      alert(data.error);
    }
  });

  async function loadTasks(date = '') {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/tasks${date ? `?date=${date}` : ''}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    displayTasks(tasks);
  }

  function displayTasks(tasks) {
    taskItems.innerHTML = '';
    if (tasks.length === 0) {
      taskItems.innerHTML = '<li class="list-group-item text-center">No tasks found.</li>';
      return;
    }

    const groupedTasks = tasks.reduce((acc, task) => {
      if (!acc[task.due_date]) acc[task.due_date] = [];
      acc[task.due_date].push(task);
      return acc;
    }, {});

    Object.keys(groupedTasks).forEach(date => {
      const dateHeader = document.createElement('li');
      dateHeader.className = 'list-group-item active';
      dateHeader.textContent = `Tasks for ${date}`;
      taskItems.appendChild(dateHeader);

      groupedTasks[date].forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        if (task.completed) {
          li.style.textDecoration = 'line-through';
          li.style.pointerEvents = 'none'; // Make it non-editable
        }
        li.innerHTML = `${task.title} 
          <input type="checkbox" ${task.completed ? "checked disabled" : ""} onclick="markTaskCompleted(${task.id}, this.checked)">
          <button class="btn btn-danger btn-sm delete-btn" data-task-id="${task.id}" ${task.completed ? "disabled" : ""}>Delete</button>`;
        taskItems.appendChild(li);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const taskId = event.target.getAttribute('data-task-id');
        deleteTask(taskId);
      });
    });
  }

  async function addTask() {
    const token = localStorage.getItem('token');
    const title = document.getElementById('taskText').value.trim();
    const due_date = taskDateInput.value;

    await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, due_date })
    });

    loadTasks();
  }

  async function markTaskCompleted(id, completed) {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    loadTasks();
  }

  async function deleteTask(id) {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    loadTasks();
  }

  addTaskButton.addEventListener('click', addTask);
  filterTasksButton.addEventListener('click', () => {
    const filterDate = filterDateInput.value.trim();
    loadTasks(filterDate);
  });
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    authContainer.classList.remove('d-none');
    appContainer.classList.add('d-none');
  });
});
