import { within, screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { setupDOM } from "../__test-utils__/setupDOM.js";    
import { initDom } from "../ui/dom.js";

let todoList;
let state;

beforeEach(async () => {
    setupDOM();
    initDom();
    todoList = await import("../ui/todoList.js");
    state = (await import("../state.js")).state;
    localStorage.clear();
});

test ("That the todos are displayed in right order", async () => {
    // Arrange
    state.todos = [
        { id: 1, text: "Deadline: projekt i team", completed: false, dueDate: "2026-02-25" },
        { id: 2, text: "Vattna blommorna", completed: false },
        { id: 3, text: "Föräldramöte", completed: false, dueDate: "2026-02-26" }
    ];
    todoList.renderTodos();

    //Act
    document.querySelector("#today-heading").click();

    //Assert
    const item = within(document.getElementById("ulList")).getAllByRole("listitem");

    expect(item[0]).toHaveTextContent("Vattna blommorna");
    expect(item[1]).toHaveTextContent("Deadline: projekt i team");
    expect(item[2]).toHaveTextContent("Föräldramöte");
});

test ("That completed todo is displayed with line-through", async () => {
  // Arrange
    state.todos = [
        { id: 2, text: "Vattna blommorna", completed: false },
    ];
    todoList.renderTodos();

    //Act
    screen.getByRole("button", { name: "Mark as complete" }).click();

    //Assert
    const item = within(document.getElementById("ulList")).getAllByRole("listitem");
    expect(item[0]).toHaveStyle("text-decoration: line-through");
});

test ("That todos marked with star is placed in the section of Important tasks", async () => {
  // Arrange
    state.todos = [
        { id: 1, text: "Deadline: projekt i team", completed: false, dueDate: "2026-02-25" },    
    ];
    todoList.renderTodos();

    //Act
    screen.getByRole("button", { name: "Star todo" }).click();

    //Assert
    const items = document.getElementById("importantList").getElementsByClassName("important-card");
    expect(items[0]).toHaveTextContent("Deadline: projekt i team");
    
});

test ("That todos gets a fullfilled yellow star at click.", async () => {
  // Arrange
    state.todos = [
        { id: 1, text: "Deadline: projekt i team", completed: false, dueDate: "2026-02-25", starred: false },    
    ];
    todoList.renderTodos();

    //Act
    screen.getByRole("button", { name: "Star todo" }).click();

    //Assert
    const items = within(document.getElementById("ulList")).getAllByRole("listitem");
    const starBtn = within(items[0]).getByRole("button", { name: "Unstar todo" });
    expect(starBtn).toHaveTextContent("⭐");
});