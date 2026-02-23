export function setupDOM() {
    document.body.innerHTML = `
    <header>
      <h1>Welcome to WebbWizards Todo-App</h1>
    </header>

    <section class="button-and-output">
      <button id="add-todo-btn" aria-label="Add new todo">
        <span class="plus-icon">+</span>
      </button>
      <p id="useroutput"></p>
    </section>

    <main>
      <div class="date-selector-box">
        <h3 id="today-heading" class="date-trigger">
          Torsdag 5/2 <span class="arrow">▼</span>
        </h3>

        <ul id="date-list" class="date-dropdown hidden">
          <li data-due-date="2026-02-25">Onsdag 25/2</li>
          <li data-due-date="2026-02-26">Torsdag 26/2</li>
          <li data-due-date="2026-02-27">Fredag 27/2</li>
        </ul>
      </div>

      <ul id="ulList"></ul>

      <div id="myModal" class="modal">
        <div class="modal-content">
          <span class="close" aria-label="Stäng modal">&times;</span>
          <h2 id="modal-title" class="modal-title">Add Todo</h2>

          <label for="new-todo-input">New Todo:</label>
          <input type="text" id="new-todo-input">

          <label for="new-todo-desc">Description:</label>
          <input type="text" id="new-todo-desc">

          <label for="new-todo-due-date">Due Date:</label>
          <input type="date" id="new-todo-due-date">

          <button id="save-todo-btn">Save Todo</button>
          <button id="remove-todo-btn" class="modal-removebtn">Remove Todo</button>
        </div>
      </div>
    </main>
    <h2>Important</h2>
    <section id="importantList" class="important-tasks">  
    </section>
  `;
}