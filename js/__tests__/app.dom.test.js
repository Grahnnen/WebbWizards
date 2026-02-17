// Load the HTML file as string before running the tests
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { setupDOM } from "../__test-utils__/setupDOM.js";  
import { state } from "../state.js";    

beforeEach(() => {
    setupDOM();
    localStorage.clear();
});

test("render initial todos from storage", async () => {
  // 1. Mock storage
  localStorage.setItem("todos", JSON.stringify([
    { id: 1, text: "Köp mjölk", completed: false }
  ]));
  
  state.selectedDate = "all" 
  await import("../app.js");

  // 2. Trigger DOMContentLoaded so the app starts
  document.dispatchEvent(new Event("DOMContentLoaded"));

  // 3. Control that todo shows in DOM
  expect(screen.getByText("Köp mjölk")).toBeInTheDocument();
});