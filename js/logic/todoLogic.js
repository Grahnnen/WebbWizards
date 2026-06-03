export function removeTodo(todos, todoToRemove) {
  return todos.filter(t => {
    if (todoToRemove.id && t.id) {
      return t.id !== todoToRemove.id;
    }
    return (t.title || t.text) !== (todoToRemove.title || todoToRemove.text);
  });
}

export function toggleTodo(todos, todoToToggle) {
  return todos.map(t => {
    const isMatch = (todoToToggle.id && t.id) 
      ? t.id === todoToToggle.id 
      : (t.title || t.text) === (todoToToggle.title || todoToToggle.text);

    if (isMatch) {
      // Vänd på statusen och se till att både isDone och completed hänger med
      const newStatus = !(t.isDone || t.completed);
      return { 
        ...t, 
        isDone: newStatus, 
        completed: newStatus 
      };
    }
    
    return t;
  });
}

