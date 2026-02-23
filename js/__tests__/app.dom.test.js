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
  localStorage.setItem("todos", JSON.stringify([
    { id: 1, text: "Köp mjölk", completed: false }
  ]));
  
  state.selectedDate = "all" 
  await import("../app.js");
  
  //Act
  document.dispatchEvent(new Event("DOMContentLoaded"));

  //Assert
  expect(screen.getByText("Köp mjölk")).toBeInTheDocument();
});