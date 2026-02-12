import { dom } from './dom.js';
import { state } from '../state.js';
import { saveTodos } from '../storage/todoStorage.js';
import { openEditModal } from './modal.js';

//this is the file where we will handle rendering the list of todos in the UI, 
// as well as any interactions related to the todo list such as toggling completion or deleting todos


// Renders the list of todos in the UI
export function renderTodos() {
  dom.todolist.innerHTML = '';
   
  const filteredTodos = state.selectedDate === 'all' // If 'all' is selected, show all todos, otherwise filter by selected date
    ? state.todos
    : state.todos.filter(todo => todo.date === state.selectedDate);

  filteredTodos.forEach(todo => { // loop through the filtered list of todos and create list items
    const li = document.createElement('li');
      if (todo.completed) {
      li.style.textDecoration = 'line-through';
    }
// Create check button
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '✅';
    checkBtn.onclick = () => toggleTodo(todo.text);

    const span = document.createElement('span');
    span.textContent = todo.text;
// Create edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✎';
    editBtn.onclick = () => openEditModal(todo.text);
// Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑';
    deleteBtn.onclick = () => removeTodo(todo.text);
// Append buttons and text to list item
    li.append(checkBtn, span, editBtn, deleteBtn);
    dom.todolist.appendChild(li);
  });
}
// Toggles the completed state of a todo
function toggleTodo(text) {
  const todo = state.todos.find(t => t.text === text);
  if (!todo) return;
// Toggle completed state
  todo.completed = !todo.completed;
  saveTodos(state.todos);
  renderTodos();
}
// Removes a todo from the list
function removeTodo(text) {
  state.todos = state.todos.filter(t => t.text !== text);
  saveTodos(state.todos);
  renderTodos();
}

