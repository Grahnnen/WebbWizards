import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { setupDOM } from "../__test-utils__/setupDOM.js";   
import { state } from "../state.js";

let modal;

//Arrange
beforeEach(async () => {
    setupDOM();
    await import("../ui/dom.js");
    modal = await import("../ui/modal.js");
    modal.setupModal();
    localStorage.clear();
});

test ("That Add Todo modal opens correctly. Make sure that the header is 'Add Todo', no delete button is shown and the inputfield is empty", async () => {
  //Act
  document.querySelector("#add-todo-btn").click();

  //Assert
  expect(screen.getByText("Add Todo")).toBeInTheDocument();
  expect(screen.queryByText("Remove")).not.toBeInTheDocument();
  expect(screen.getByLabelText("New Todo:")).toHaveValue("");
});

test ("That Edit modal opens correctly. Make sure that the header is 'Edit Todo', delete button is shown and the inputfield is filled with todo text", async () => {
  // Act
  state.todos = [{ id: 1, text: "Köp mjölk", completed: false }];
  modal.openEditModal("Köp mjölk");

  // Assert
  expect(screen.getByText("Edit Todo")).toBeInTheDocument();
  expect(screen.getByText("Remove Todo")).toBeInTheDocument();
  expect(screen.getByLabelText("New Todo:")).toHaveValue("Köp mjölk");
});

test ("That the modal is closed when close button is clicked", async () => {
  // Act
  state.todos = [{ id: 1, text: "Köp mjölk", completed: false }];
  modal.openEditModal("Köp mjölk");
  document.querySelector(".close").click();

  // Assert
  expect(screen.getByText("Edit Todo")).not.toBeVisible();
});

test ("That the modal is closed when save button is clicked in edit modal", async () => {  
  // Act
  state.todos = [{ id: 1, text: "Köp mjölk", completed: false }];
  modal.openEditModal("Köp mjölk");

  state.editingTodoElement = "Köp mjölk";

  const input = screen.getByLabelText("New Todo:");
  input.value = "Köp flera mjölk";
  document.querySelector("#save-todo-btn").click();
    
  // Assert
  expect(screen.getByText("Edit Todo")).not.toBeVisible();
});

test ("That the modal is closed when escape key is pressed", async () => {
  // Act
  document.querySelector("#add-todo-btn").click();
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    
  // Assert
  expect(screen.getByText("Add Todo")).not.toBeVisible();
});

test ("That the todo is removed when remove button is clicked in edit modal", async () => {
  // Arrange
  state.todos = [{ id: 1, text: "Köp mjölk", completed: false }];
  modal.openEditModal("Köp mjölk");

  // Act
  document.querySelector("#remove-todo-btn").click();

  // Assert
  expect(state.todos.length).toBe(0);
});
