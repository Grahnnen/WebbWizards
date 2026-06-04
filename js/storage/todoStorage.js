import { API_BACKEND_TODO_BASE_URL } from '../env.js';

function isValidTodo(todo) {
  return (
    todo !== null &&
    typeof todo === 'object' &&
    typeof todo.title === 'string' &&
    todo.title.trim() !== ''
  );
}

// Loads todos from backend storage, returns an empty array if none found or on error
export async function loadTodos() {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`${API_BACKEND_TODO_BASE_URL}/api/v1/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load todos from backend.');
    }

    const data = await response.json();
    const todoList = Array.isArray(data) ? data : (data.items || []);

    return todoList.filter(isValidTodo);
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
}

export async function saveTodos(todos) {
  if (!Array.isArray(todos)) return;
  
  const validTodos = todos.filter(isValidTodo);
  if (validTodos.length === 0) return;

  const todoToSave = validTodos[validTodos.length - 1];

  try {
    const response = await fetch(`${API_BACKEND_TODO_BASE_URL}/api/v1/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
      body: JSON.stringify({
        title: todoToSave.title,
        description: todoToSave.description || '',
        dueDate: todoToSave.dueDate || '',
        isDone: todoToSave.isDone || false,
        isStarred: todoToSave.isStarred || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to save todo:', errorData);
      throw new Error('Failed to save todo to backend.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving todo:', error);
    throw error;
  }
}

export async function saveUpdatedTodo(todo) {
  if(!todo || !todo.id) {
    console.error('Todo must have an id to be updated');
    return;
  }

  try {
    const response = await fetch(`${API_BACKEND_TODO_BASE_URL}/api/v1/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
      body: JSON.stringify({
        title: todo.title,
        description: todo.description || '',
        dueDate: todo.dueDate || '',
        isDone: todo.isDone || false,
        isStarred: todo.isStarred || todo.starred || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to save updated todo:', errorData);
      throw new Error('Failed to save updated todo to backend.');
    }
    return true;
  } catch (error) {
    console.error('Error saving updated todo:', error);
    throw error;
  }
}