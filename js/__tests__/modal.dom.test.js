import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { setupDOM } from "../__test-utils__/setupDOM.js";    

test ("Open Add Todo correctly. Make sure that the header is 'Add Todo', no delete button is shown and the inputfield is empty", async () => {
  // Arrange
    setupDOM();
    const modal = await import("../ui/modal.js");
    modal.setupModal();

    //Act
    document.querySelector("#add-todo-btn").click();

    //Assert
    expect(screen.getByText("Add Todo")).toBeInTheDocument();
    expect(screen.queryByText("Remove")).not.toBeInTheDocument();
    expect(screen.getByLabelText("New Todo:")).toHaveValue("");

});

test ("Make sure modal open right view when clicking edit-button and that the inputfield is filled with todo text and delete button is shown", async () => {
   // Arrange
    setupDOM();
    await import("../ui/dom.js");
    const { state } = await import("../state.js");
    const modal = await import("../ui/modal.js");
    modal.setupModal();
   
    // Act
    state.todos = [{ id: 1, text: "Köp mjölk", completed: false }];
    modal.openEditModal("Köp mjölk");

    // Assert
    expect(screen.getByText("Edit Todo")).toBeInTheDocument();
    expect(screen.getByText("Remove Todo")).toBeInTheDocument();
    expect(screen.getByLabelText("New Todo:")).toHaveValue("Köp mjölk");
});