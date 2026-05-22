import { dom, initDom } from "./dom.js";
import { state } from "../state.js";
import { loadingState } from "../state.js";
import { saveTodos } from "../storage/todoStorage.js";
import { renderTodos } from "./todoList.js";
import { API_BACKEND_BASE_URL } from "../env.js"; // Update this to match your backend URL and port
// this is the file where we will handle the modal for adding and editing todos,
// including opening, closing, and saving from the modal

export function setupModal() {
  initDom();
  dom.addbtn.onclick = openAddModal;
  dom.generateDescBtn.onclick = generateDescription;
  dom.savebtn.onclick = saveFromModal;
  dom.removebtn.onclick = removeFromModal;
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
    var response = await fetch(`${API_BACKEND_BASE_URL}/generate-description`, {
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

function saveFromModal() {
  const text = dom.inputfield.value.trim();
  const desc = dom.descfield.value.trim();
  const dueDate = dom.dueDate.value;

  if (!text) {
    dom.todoError.textContent = "Du måste ange en todo.";
    return;
  }

  if (state.editingTodoElement) {
    const todo = state.todos.find((t) => t.text === state.editingTodoElement);
    todo.text = text;
    todo.description = desc;
    todo.dueDate = dueDate;
  } else {
    state.todos.push({
      text,
      description: desc,
      dueDate,
      completed: false,
      starred: false,
    });
  }

  saveTodos(state.todos);
  renderTodos();
  closeModal();
}
function removeFromModal() {
  state.todos = state.todos.filter((t) => t.text !== state.editingTodoElement);
  saveTodos(state.todos);
  renderTodos();
  closeModal();
}

function closeModal() {
  dom.modal.style.display = "none";
}

export function openEditModal(todoText) {
  const todo = state.todos.find((t) => t.text === todoText);
  if (!todo) return;

  state.editingTodoElement = todoText;

  dom.modaltitle.textContent = "Edit Todo";
  dom.removebtn.style.display = "block";

  document.querySelector('label[for="new-todo-input"]').textContent =
    "Edit Todo";
  document.getElementById("save-todo-btn").textContent = "Update Todo";

  dom.inputfield.value = todo.text;
  dom.descfield.value = todo.description || "";
  dom.dueDate.value = todo.dueDate || "";

  dom.modal.style.display = "flex";
  dom.inputfield.focus();
}
