import { dom } from './dom.js';
import { state } from '../state.js';
import { saveTodos } from '../storage/todoStorage.js';
import { openEditModal } from './modal.js';
import { toggleTodo, removeTodo } from '../logic/todoLogic.js';

//this is the file where we will handle rendering the list of todos in the UI, 
// as well as any interactions related to the todo list such as toggling completion or deleting todos


// Renders the list of todos in the UI
export function renderTodos() {
  dom.todolist.innerHTML = '';
// Loop through todos and create list items
  state.todos.forEach(todo => {
    const li = document.createElement('li');
// Create check button
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = todo.completed ? '✅' : '⬜ ';
    checkBtn.onclick = () => toggleTodoClicked(todo.text);

    const span = document.createElement('span');
    span.textContent = todo.text;
// Create edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✎';
    editBtn.onclick = () => openEditModal(todo.text);
// Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑';
    deleteBtn.onclick = () => removeTodoClicked(todo.text);
// Append buttons and text to list item
    li.append(checkBtn, span, editBtn, deleteBtn);
    dom.todolist.appendChild(li);
  });
}
// Toggles the completed state of a todo
function toggleTodoClicked(text) {
  const todo = state.todos.find(t => t.text === text);
  if (!todo) return;
  state.todos = toggleTodo(state.todos, text);
  saveTodos(state.todos);
  renderTodos();
}
// Removes a todo from the list
function removeTodoClicked(text) {
  state.todos = removeTodo(state.todos, text);
  saveTodos(state.todos);
  renderTodos();
}

