import { API_BACKEND_TODO_BASE_URL } from '../env.js';

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
    if (!Array.isArray(data)) return [];

    return data.filter(isValidTodo);
  } catch (error) {
    console.error('Error loading todos:', error);
    return [];
  }
}

export async function saveTodos(todos) {
  if (!Array.isArray(todos)) return;

  const validTodos = todos.filter(isValidTodo);
  await fetch(`${API_BACKEND_TODO_BASE_URL}/api/v1/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
    },
    body: JSON.stringify(validTodos),
  });
}

function isValidTodo(todo) {
  return (
    typeof todo === 'object' &&
    todo !== null &&
    typeof todo.text === 'string' &&
    typeof todo.completed === 'boolean'
  );
}

