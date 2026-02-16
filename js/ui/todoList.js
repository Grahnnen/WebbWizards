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
    : state.todos.filter(todo => todo.dueDate === state.selectedDate);

  // Sort todos by due date, with those without a due date at the top
  filteredTodos.sort((a, b) => {
  if (!a.dueDate && b.dueDate) return -1

  if (!b.dueDate && a.dueDate) return 1

  if (a.dueDate && b.dueDate) {
    return new Date(a.dueDate) - new Date(b.dueDate)
  }

  return 0
})

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
  // Create star button
    const starBtn = document.createElement('button');
    starBtn.innerHTML = todo.starred ? '⭐' : '☆';
    starBtn.setAttribute('aria-label', todo.starred ? 'Unstar todo' : 'Star todo');
    starBtn.onclick = () => toggleStar(todo.text);
// Create edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✎';
    editBtn.onclick = () => openEditModal(todo.text);
// Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑';
    deleteBtn.onclick = () => removeTodo(todo.text);
// Append buttons and text to list item
    li.append(checkBtn, span, starBtn, editBtn, deleteBtn);
    dom.todolist.appendChild(li);
  });
   renderImportantTodos();
}
// Toggles the starred state of a todo
function renderImportantTodos() {
  if (!dom.importantList) return;

  dom.importantList.innerHTML = '';

  const starred = state.todos.filter(t => t.starred);

  if (starred.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No important todos yet.';
    dom.importantList.appendChild(li);
    return;
  }

  starred.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text + " / " + todo.dueDate;;
    li.id = "box-element";
    li.className = "box-element";
    dom.importantList.appendChild(li);
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
function toggleStar(text) {
  const todo = state.todos.find(t => t.text === text);
  if (!todo) return;

  todo.starred = !todo.starred;
  saveTodos(state.todos);
  renderTodos();
}
// Removes a todo from the list
function removeTodo(text) {
  state.todos = state.todos.filter(t => t.text !== text);
  saveTodos(state.todos);
  renderTodos();
}