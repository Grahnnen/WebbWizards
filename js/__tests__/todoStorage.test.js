import { loadTodos, saveTodos } from "../storage/todoStorage";
import { API_BACKEND_TODO_BASE_URL } from "../env.js";

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: async () => [] })
  );
});

test("returns empty array if backend returns no todos", async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  const result = await loadTodos();
  expect(result).toEqual([]);
  expect(global.fetch).toHaveBeenCalledWith(
    `${API_BACKEND_TODO_BASE_URL}/api/v1/todos`,
    expect.objectContaining({ method: 'GET' })
  );
});

test("saves todos to backend", async () => {
  const todos = [{ text: "Test", completed: false }];
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

  await saveTodos(todos);

  expect(global.fetch).toHaveBeenCalledWith(
    `${API_BACKEND_TODO_BASE_URL}/api/v1/todos`,
    expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(todos),
    })
  );
});

test("loads todos from backend", async () => {
  const todos = [{ text: "Stored todo", completed: true }];
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => todos });

  const result = await loadTodos();
  expect(result).toEqual(todos);
});

test("returns empty array if backend JSON is invalid", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => {
      throw new SyntaxError('Unexpected token');
    },
  });

  const result = await loadTodos();
  expect(result).toEqual([]);
});

test("returns empty array if backend response is not an array", async () => {
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => "hello" });

  const result = await loadTodos();
  expect(result).toEqual([]);
});

test("filters out invalid todo objects from backend response", async () => {
  const badData = [
    { text: "Valid", completed: true },
    { wrong: true },
    { text: 123, completed: false },
  ];
  global.fetch.mockResolvedValueOnce({ ok: true, json: async () => badData });

  const result = await loadTodos();
  expect(result).toEqual([{ text: "Valid", completed: true }]);
});
