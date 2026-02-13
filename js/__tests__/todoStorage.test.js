import { loadTodos, saveTodos } from "../storage/todoStorage";

beforeEach(() => {
  localStorage.clear();
});

test("returns empty array if no todos in storage", () => {
  const result = loadTodos();
  expect(result).toEqual([]);
});

test("saves todos to localStorage", () => {
  const todos = [
    { text: "Test", completed: false }
  ];

  saveTodos(todos);

  const stored = JSON.parse(localStorage.getItem("todos"));
  expect(stored).toEqual(todos);
});

test("loads todos from localStorage", () => {
  const todos = [
    { text: "Stored todo", completed: true }
  ];

  localStorage.setItem("todos", JSON.stringify(todos));

  const result = loadTodos();

  expect(result).toEqual(todos);
});

test("returns empty array if JSON is invalid", () => {
  localStorage.setItem("todos", "not valid json");

  expect(loadTodos()).toEqual([]);
});

test("returns empty array if stored value is not array", () => {
  localStorage.setItem("todos", JSON.stringify("hello"));

  expect(loadTodos()).toEqual([]);
});

test("filters out invalid todo objects", () => {
  const badData = [
    { text: "Valid", completed: true },
    { wrong: true },
    { text: 123, completed: false }
  ];

  localStorage.setItem("todos", JSON.stringify(badData));

  const result = loadTodos();

  expect(result).toEqual([
    { text: "Valid", completed: true }
  ]);
});
