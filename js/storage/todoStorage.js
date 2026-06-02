import { API_BACKEND_TODO_BASE_URL } from '../env.js'; // Update this to match your backend URL and port

// This file handles loading and saving todos to localStorage

// Loads todos from localStorage, returns an empty array if none found
export async function loadTodos() {
  try {
    const token = localStorage.getItem("jwtToken");
     const response = await fetch(`${API_BACKEND_TODO_BASE_URL}/api/v1/todos`, {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            },
            });
        
          if (!response.ok) {
            throw new Error('Failed to load todos.');
          }
    
          const data = await response.json();

    if (!Array.isArray(data)) return [];

     return data.filter(isValidTodo);

  } catch (error) {
    console.error("Error loading todos:", error);
    return [];
  }
}

export async function saveTodos(todos) {
 if (!Array.isArray(todos)) return;

  const validTodos = todos.filter(isValidTodo);

  await fetch(`${API_BACKEND_TODO_BASE_URL}/api/v1/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(validTodos),
    });
  }

// todoStorage.js

function isValidTodo(todo) {
  return (
    typeof todo === "object" &&
    typeof todo.text === "string" &&
    typeof todo.completed === "boolean"
  );
}

