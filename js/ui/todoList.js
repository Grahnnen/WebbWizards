import { dom } from './dom.js';
import { state } from '../state.js';
import { saveTodos, saveUpdatedTodo } from '../storage/todoStorage.js';
import { openEditModal } from './modal.js';
import { toggleTodo, removeTodo } from '../logic/todoLogic.js';
import { API_BACKEND_TODO_BASE_URL } from '../env.js';

//this is the file where we will handle rendering the list of todos in the UI, 
// as well as any interactions related to the todo list such as toggling completion or deleting todos


// Renders the list of todos in the UI
export function renderTodos() {
  dom.todolist.innerHTML = '';
// Loop through todos and create list items
const filteredTodos = state.selectedDate === 'all' // If 'all' is selected, show all todos, otherwise filter by selected date
    ? state.todos
    : state.todos.filter(todo => todo.dueDate === state.selectedDate)
    
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

    const isTodoDone = todo.isDone || todo.completed || false; // Check both isDone and completed for backward compatibility
    const isTodoStarred = todo.isStarred || todo.starred || false;
    const currentIdentifier = todo.title || todo.text || ''; // Use title if available, otherwise fallback to text
    
    if (isTodoDone) {
      li.style.textDecoration = 'line-through';
    }

// Create check button
    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = isTodoDone ? '✅' : '⬜';
    checkBtn.setAttribute('aria-label', isTodoDone ? 'mark as uncomplete' : 'Mark as complete');
    
    checkBtn.onclick = () => toggleTodoClicked(todo);

    const span = document.createElement('span');
    span.textContent = currentIdentifier;

  // Create star button
    const starBtn = document.createElement('button');
    starBtn.innerHTML = isTodoStarred ? '⭐' : '☆';
    starBtn.setAttribute('aria-label', isTodoStarred ? 'Unstar todo' : 'Star todo');
    starBtn.onclick = () => toggleStar(todo);
    
// Create edit button
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '✎';
    editBtn.setAttribute('aria-label', 'Edit todo');
    editBtn.onclick = () => openEditModal(currentIdentifier);

// Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑';
    deleteBtn.setAttribute('aria-label', 'remove todo'); 
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        removeTodoClicked(todo);
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

  const starred = state.todos.filter(t => t.isStarred || t.starred);

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
    card.textContent = `${todo.title || todo.text} ${todo.dueDate ?? ''}`.trim();
    dom.importantList.appendChild(card);
  });
}
// Toggles the completed state of a todo
async function toggleTodoClicked(todo) {
  if (!todo) return;

  todo.isDone = !todo.isDone || !todo.completed; // Toggle isDone, but also check completed for backward compatibility
  todo.completed = todo.isDone; // Ensure completed is updated for backward compatibility

  try {
    if (todo.id) {
      await saveUpdatedTodo(todo);
    }
    renderTodos();
  } catch (error) {
    console.error('Error updating todo:', error);
    todo.isDone = !todo.isDone; // Revert the change if saving fails
    todo.completed = todo.isDone; // Revert completed as well
    renderTodos();
  }
}
async function toggleStar(todo) {
  if (!todo) return;

  todo.isStarred = !todo.isStarred || !todo.starred; // Toggle isStarred, but also check starred for backward compatibility
  todo.starred = todo.isStarred; // Ensure starred is updated for backward compatibility
  
  try {
    if (todo.id) {
      await saveUpdatedTodo(todo);
    }
    renderTodos();
  } catch (error) {
    console.error('Error starring todo:', error);
    todo.isStarred = !todo.isStarred;
    todo.starred = todo.isStarred;
    renderTodos();
  }
}
// Removes a todo from the list
async function removeTodoClicked(todo) {
  if (!todo) return;

  if (!confirm("Are you sure you want to delete this todo?")) return;
  
  try {
    if (todo.id) {
      const response = await fetch(`${API_BACKEND_TODO_BASE_URL}/api/v1/todos/${todo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
    }

    state.todos = state.todos.filter(t => t.id !== todo.id || (t.text !== todo.text && t.title !== todo.title));
    renderTodos();
  } catch (error) {
    console.error('Error deleting todo:', error);
    alert('Failed to delete todo, please try again later.');
  }
}