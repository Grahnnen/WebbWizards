// Load the HTML file as string before running the tests
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { setupDOM } from "../__test-utils__/setupDOM.js";  
import { state } from "../state.js";    

beforeEach(() => {
    setupDOM();
    localStorage.clear();
});

test("That the app renders initial todos from storage", async () => {
  //Arrange
  const todos = [{ id: 1, text: "Köp mjölk", completed: false }];
  localStorage.setItem("jwtToken", "test-token");
  state.selectedDate = "all";

  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: async () => todos })
  );

  await import("../app.js");
  
  //Act
  document.dispatchEvent(new Event("DOMContentLoaded"));

  //Assert
  expect(await screen.findByText("Köp mjölk")).toBeInTheDocument();
});