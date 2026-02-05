import { state } from './state.js';
import { loadTodos } from './storage/todoStorage.js';
import { renderTodos } from './ui/todoList.js';
import { setupModal } from './ui/modal.js';


// this is the main entry point for our app, where we will initialize the state,
//  load todos from storage, and set up the UI components such as the todo list and modal

document.addEventListener('DOMContentLoaded', () => {
  state.todos = loadTodos();
  renderTodos();
  setupModal();
});
