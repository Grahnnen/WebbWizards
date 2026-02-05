// This file handles loading and saving todos to localStorage

// Handles loading and saving todos to localStorage
const STORAGE_KEY = 'todos';
// Loads todos from localStorage, returns an empty array if none found
export function loadTodos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
