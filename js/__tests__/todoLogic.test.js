import { toggleTodo, removeTodo } from "../logic/todoLogic";
test('todologic test for remove', () => {
//    const todos = loadTodos();
    const todos = [
        { text: 'Task 1', completed: false },
        { text: 'Task 2', completed: true },
        { text: 'Task 3', completed: false }
      ];
    const newTodos = removeTodo(todos, 'Task 2');
    expect(newTodos.length).toBe(2);
    expect(newTodos.find(t => t.text === 'Task 2')).toBeUndefined();
});

test('todologic test for toggle', () => {
    const todos = [
        { text: 'Task 1', completed: false },
        { text: 'Task 2', completed: true },
        { text: 'Task 3', completed: false }
      ];
    const newTodos = toggleTodo(todos, 'Task 1');
    expect(newTodos.find(t => t.text === 'Task 1').completed).toBe(true);
    const newTodos2 = toggleTodo(newTodos, 'Task 2');
    expect(newTodos2.find(t => t.text === 'Task 2').completed).toBe(false);
});