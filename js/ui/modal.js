import { dom, initDom } from "./dom.js";
import { state } from "../state.js";
import { loadingState } from "../state.js";
import { saveTodos, saveUpdatedTodo } from "../storage/todoStorage.js";
import { renderTodos } from "./todoList.js";
import { ENV } from "../env.js";
// this is the file where we will handle the modal for adding and editing todos,
// including opening, closing, and saving from the modal

export function setupModal() {
  initDom();
  dom.addbtn.onclick = openAddModal;
  dom.generateDescBtn.onclick = generateDescription;
  dom.savebtn.onclick = async (e) => {
    if (e) e.preventDefault();
    await saveFromModal();
  };
  dom.removebtn.onclick = async () => {
    await removeFromModal();
  };
  dom.closeBtn.onclick = closeModal;

  window.onclick = (e) => {
    if (e.target === dom.modal) closeModal();
  };
}

document.addEventListener("keydown", (e) => {
  if (dom.modal.style.display === "flex" && e.key === "Escape") {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (dom.modal.style.display === "flex" && e.key === "Enter") {
    if (
      document.activeElement === dom.inputfield ||
      document.activeElement === dom.descfield ||
      document.activeElement === dom.dueDate
    ) {
      saveFromModal();
    }
  }
});

function openAddModal() {
  state.editingTodoElement = null;
  dom.modaltitle.textContent = "Add Todo";
  dom.removebtn.style.display = "none";
  dom.inputfield.value = "";
  dom.descfield.value = "";
  dom.dueDate.value = "";
  dom.modal.style.display = "flex";
  dom.inputfield.focus();
  document.querySelector('label[for="new-todo-input"]').textContent =
    "New Todo";
  document.getElementById("save-todo-btn").textContent = "Save Todo";
}

async function generateDescription() {
  loadingState(true);

  dom.generateDescBtn.disabled = true;
  dom.loadingSpinner.classList.remove("hidden");
  dom.generateDescBtnText.textContent = "Generating...";

  const descError = dom.descError;
  descError.textContent = "";

  try {
    var response = await fetch(`${ENV.API_BACKEND_TODO_BASE_URL}/api/v1/ai/description`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({title: dom.inputfield.value.trim()}),
    });

    if (!response.ok) {
      throw new Error("Failed to generate description, try again later.");
    }

    const data = await response.json();
    dom.descfield.value = data.description;

  } catch (error) {
    console.error("Error generating description:", error);
    descError.textContent = "Failed to generate description, try again later.";
  } finally {
    loadingState(false);
    dom.generateDescBtn.disabled = false;
    dom.loadingSpinner.classList.add("hidden");
    dom.generateDescBtnText.textContent = "Generate Description";
  }
}

async function saveFromModal() {
  const text = dom.inputfield.value.trim();
  const desc = dom.descfield.value.trim();
  const dueDate = dom.dueDate.value;

  if (!text) {
    dom.todoError.textContent = "You must enter a todo.";
    return;
  }

  try {
    if (state.editingTodoElement) {
      const todo = state.todos.find((t) => (t.title || t.text) === state.editingTodoElement);
      if(todo) {
      todo.title = text;
      todo.description = desc;
      todo.dueDate = dueDate;
      await saveUpdatedTodo(todo);
      }
    } else {
      const newTodo = {
        title: text,
        description: desc,
        dueDate,
        isDone: false,
        isStarred: false,
      };
      state.todos.push(newTodo);   
      const savedTodo = await saveTodos(state.todos);
      if (savedTodo && savedTodo.id) {
        newTodo.id = savedTodo.id; // Assign the returned ID to the local todo object
      } 
    }

    renderTodos();
    closeModal();

} catch (error) {
    console.error("Error saving todo:", error);
    dom.todoError.textContent = "Failed to save todo, try again later.";
  }
}

async function removeFromModal() {
 
  const todo = state.todos.find((t) => (t.title || t.text) === state.editingTodoElement);

  if (!todo) {
    console.error("Todo not found.");
    return;
  }

  if(!todo.id || !confirm("Are you sure you want to delete this todo?")) {
    return;
  }

  try {
    const response = await fetch(`${ENV.API_BACKEND_TODO_BASE_URL}/api/v1/todos/${todo.id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
    }
  });

  if (!response.ok) {
    throw new Error("Failed to delete todo, try again later.");
  }
    state.todos = state.todos.filter((t) => t.id !== todo.id);

    renderTodos();
    closeModal();

  } catch (error) {
    console.error("Error removing todo:", error);
    dom.todoError.textContent = "Failed to remove todo, try again later.";
  }
}

function closeModal() {
  dom.modal.style.display = "none";
  if (dom.todoError) dom.todoError.textContent = "";
}

export function openEditModal(todoText) {
  const todo = state.todos.find((t) => (t.title || t.text) === todoText);
  if (!todo) return;

  state.editingTodoElement = todoText;

  dom.modaltitle.textContent = "Edit Todo";
  dom.removebtn.style.display = "block";

  document.querySelector('label[for="new-todo-input"]').textContent =
    "Edit Todo";
  document.getElementById("save-todo-btn").textContent = "Update Todo";

  dom.inputfield.value = todo.title || todo.text;
  dom.descfield.value = todo.description || "";
  dom.dueDate.value = todo.dueDate || "";

  dom.modal.style.display = "flex";
  dom.inputfield.focus();
}
