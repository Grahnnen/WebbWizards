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
  const filteredTodos = state.selectedDate === 'all' // If 'all' is selected, show all todos, otherwise filter by selected date
    ? state.todos
    : state.todos.filter(todo => todo.dueDate === state.selectedDate);

  // Sort todos by due date, with those without a due date at the top
  filteredTodos.sort((a, b) => {
  if (!a.dueDate && b.dueDate) return -1;

  if (!b.dueDate && a.dueDate) return 1;

  if (a.dueDate && b.dueDate) {
    return new Date(a.dueDate) - new Date(b.dueDate) 
  }

  return 0;
});

  filteredTodos.forEach(todo => { // loop through the filtered list of todos and create list items
    const li = document.createElement('li');

    li.tabIndex = 0;

      if (todo.completed) {
      li.style.textDecoration = 'line-through';
    }
// Create check button
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = todo.completed ? '✅' : '⬜ ';
    checkBtn.tabIndex = 0;

    // Keyboard support
    checkBtn.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        toggleTodoClicked(todo.text);
      }
    };
    checkBtn.onclick = () => toggleTodoClicked(todo.text);

    console.log("Rendering todo:", todo.text, "Completed:", todo.completed);

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

    editBtn.tabIndex = 0;
    editBtn.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') openEditModal(todo.text);
    };

    editBtn.onclick = () => openEditModal(todo.text);
// Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑';
    
    // Keyboard support
    deleteBtn.tabIndex = 0;
    deleteBtn.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation(); 
        removeTodoClicked(todo.text);
      }
    };
    
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        removeTodoClicked(todo.text);
    };
    
    li.onkeydown = (e) => {
      if (e.target === li && e.key === 'Enter') {
        openEditModal(todo.text);
      }
    };
    
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
    const card = document.createElement('div');
    card.className = 'important-card empty';
    card.textContent = 'No important todos yet.';
    dom.importantList.appendChild(card);
    return;
  }

  starred.forEach(todo => {
    const card = document.createElement('div');
    card.className = 'important-card';
    card.textContent = `${todo.text} / ${todo.dueDate ?? ''}`.trim();
    dom.importantList.appendChild(card);
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
function toggleStar(text) {
  const todo = state.todos.find(t => t.text === text);
  if (!todo) return;

  todo.starred = !todo.starred;
  saveTodos(state.todos);
  renderTodos();
}
// Removes a todo from the list
function removeTodoClicked(text) {
  state.todos = removeTodo(state.todos, text);
  saveTodos(state.todos);
  renderTodos();
}