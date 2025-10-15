const taskList = document.querySelector('ul.task-list');
const taskForm = document.getElementById('task-form');

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Рендеринг карток
function loadTasks(filterStatus = "all") {
fetch("/api/tasks/")
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })
        .then((tasks) => {
            console.log(tasks);
            taskList.innerHTML = "";
            const filtered = filterStatus === "all"
            ? tasks
            : tasks.filter(task => task.status === filterStatus);

            const markup = filtered.map(task => {
                return `
                  <li class="task-list-item" data-id="${task.id}">
                    <p>Title: <span class="task-title">${task.title}</span></p>
                    <p>Description: <span class="task-description">${task.description}</span></p>
                    <p class="task-status">Status: ${task.status}</p>
                    <p class="task-date">Due date: ${task.due_date}</p>
                    <button class="edit-task-button">Edit</button>
                    <button class="delete-task-button">Delete task</button>
                  </li>`}).join("");
                taskList.insertAdjacentHTML('beforeend', markup);
                attachDeleteHandlers();
                attachEditHandlers();
        })
        .catch((error) => {
            console.log(error);
        });
}

const statusFilter = document.getElementById("status-filter");

// Фільтрація по статусу
statusFilter.addEventListener("change", () => {
  const selectedStatus = statusFilter.value;
  loadTasks(selectedStatus);
});


// Створення задачі через форму
taskForm.addEventListener("submit", event => {
  event.preventDefault();


  taskForm.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
  taskForm.querySelectorAll(".form-error-message").forEach(el => el.remove());

  const formData = new FormData(taskForm);
  const data = Object.fromEntries(formData.entries());

  let hasError = false;

  if (!data.title.trim()) {
    markError("title", "Field 'Title' required");
    hasError = true;
  }

  if (hasError) return;

  if (!data.due_date) {
    delete data.due_date;
  }

  fetch("/api/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-CSRFToken": getCookie("csrftoken")
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) throw new Error("Error with creating task");
      return response.json();
    })
    .then(task => {
      taskForm.reset();
      loadTasks();
    })
    .catch(error => {
      alert("Error:" + error);
    });
});

function markError(fieldName, message) {
  const field = taskForm.querySelector(`[name="${fieldName}"]`);
  field.classList.add("error");

  const errorMsg = document.createElement("div");
  errorMsg.className = "form-error-message";
  errorMsg.textContent = message;
  field.insertAdjacentElement("afterend", errorMsg);
}

loadTasks();

function attachEditHandlers() {
  const editButtons = document.querySelectorAll(".edit-task-button");

  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      const li = button.closest("li.task-list-item");
      const taskId = li.dataset.id;

      const title = li.querySelector(".task-title").textContent;
      const description = li.querySelector(".task-description").textContent;
      const status = li.querySelector(".task-status").textContent;
      const date = li.querySelector(".task-date").textContent;

      li.innerHTML = `
        <div class="card-edit-wrapper">
            <label>Title:
              <input type="text" name="title" value="${title}">
            </label>
            <label>Description:
            <input type="text" name="description" value="${description}">
            </label>
            <label>Status:
            <select name="status">
              <option value="pending" ${status === "pending" ? "selected" : ""}>Pending</option>
              <option value="in-progress" ${status === "in-progress" ? "selected" : ""}>In progress</option>
              <option value="completed" ${status === "completed" ? "selected" : ""}>Completed</option>
            </select>
            </label>
            <label>Due date:
            <input type="date" name="due_date" value="${date !== "—" ? date : ""}">
            </label>
            <button class="save-task-button">Save</button>
            <button class="cancel-task-button">Cancel</button>
        </div>
      `;

      li.querySelector(".save-task-button").addEventListener("click", () => {
        const updated = {
          title: li.querySelector('[name="title"]').value,
          description: li.querySelector('[name="description"]').value,
          status: li.querySelector('[name="status"]').value,
          due_date: li.querySelector('[name="due_date"]').value || null
        };

        fetch(`/api/tasks/${taskId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRFToken": getCookie("csrftoken")
          },
          body: JSON.stringify(updated)
        })
        .then(response => {
          if (!response.ok) throw new Error("Update failed");
          return response.json();
        })
        .then(() => {
          loadTasks();
        })
        .catch(err => {
          console.log("Error", err);
        });
      });

      li.querySelector(".cancel-task-button").addEventListener("click", () => {
        loadTasks();
      });
    });
  });
}

//идалення картки

function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll(".delete-task-button");

  deleteButtons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      const li = button.closest("li.task-list-item");
      const taskId = li.dataset.id;

      const confirmed = confirm("Are you sure you want to delete this task?");
      if (!confirmed) {
          return;
      }

      fetch(`/api/tasks/${taskId}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          "Accept": "application/json"
        }
      })
      .then(response => {
        if (!response.ok) throw new Error("Error with deleting task");
        li.remove();
      })
      .catch(error => {
        console.log("Error", error);
      });
    });
  });
}
