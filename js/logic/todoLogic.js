export function removeTodo(todos, text) {
  return todos.filter(t => t.text !== text);
}

export function toggleTodo(todos, text) {
  return todos.map(t =>
    t.text === text ? { ...t, completed: !t.completed } : t
  );
}

