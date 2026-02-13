// This file handles loading and saving todos to localStorage

// Handles loading and saving todos to localStorage
const STORAGE_KEY = 'todos';
// Loads todos from localStorage, returns an empty array if none found
export function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

     return parsed.filter(isValidTodo);

  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
}

export function saveTodos(todos) {
  if (!Array.isArray(todos)) return;

  const validTodos = todos.filter(isValidTodo);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(validTodos));
}

// todoStorage.js

function isValidTodo(todo) {
  return (
    typeof todo === "object" &&
    typeof todo.text === "string" &&
    typeof todo.completed === "boolean"
  );
}

