const inputfield = document.getElementById('new-todo-input');
const addbtn = document.getElementById('add-todo-btn');
const todolist = document.getElementById('ulList');
const useroutput = document.getElementById('useroutput');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const savebtn = document.getElementById('save-todo-btn');
const modaltitle = document.getElementById('modal-title');
const descfield = document.getElementById('new-todo-desc');

let todos = [];

//initialize and add all todos from localStorage
function init() {

    todolist.innerHTML = '';
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    todos = storedTodos;
    console.log(storedTodos);
    if (storedTodos) {
        storedTodos.forEach(function(todo) {
            AddTodo(todo.text, todo.completed, todo.description);
        });
    }
}

//Open Add Todo Modal
addbtn.addEventListener('click', function() {
    const todoText = inputfield.value.trim();
    modaltitle.innerHTML = "Add Todo";
    modal.style.display = "flex";
});
//Save Todo from Modal
savebtn.addEventListener('click', function() {
    const todoText = inputfield.value.trim();
    const todoDesc = descfield.value.trim();

    const todoIndex = todos.findIndex(t => t.text === todoText);

    if (todoText !== '' && todoIndex === -1) {
        AddTodo(todoText, false, todoDesc);
        todos.push({text: todoText, description: todoDesc, completed: false});
        localStorage.setItem('todos', JSON.stringify(todos));
        // clear input field and close modal
        inputfield.value = "Titel";
        descfield.value = "Description";
        modal.style.display = "none";
        console.log("Todo Added: " + todoText);
    }
    else if (todoIndex !== -1) {
        // Update existing todo
        todos[todoIndex].description = todoDesc;
        localStorage.setItem('todos', JSON.stringify(todos));
        // clear input field and close modal
        inputfield.value = "Titel";
        descfield.value = "Description";
        modal.style.display = "none";
        useroutput.innerHTML = "<p style='color:green'>Todo was updated!</p>";
        console.log("Todo updated: " + todoText);
    }
    else{
        alert("Todo cannot be empty or duplicate!");
    }
    todolist.innerHTML = '';
    init();
});
//Close Modal
span.onclick = function() {
     inputfield.value = "";
    descfield.value = "";
  modal.style.display = "none";
}
//Close Modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == modal) {
    inputfield.value = "";
    descfield.value = "";
    modal.style.display = "none";
  }
}

function AddTodo(todoText, completed = false, description = "")
{
    // Provide feedback to the user
    useroutput.innerHTML = "<p style='color:green'>Todo was added!</p>";
    
    // Create list item
    const li = document.createElement('li');

    // Set text decoration if completed
    if (completed) {
        li.style.textDecoration = 'line-through';
    }

    // Create check button
    var checkBtn = document.createElement('button');
    checkBtn.innerHTML = "&#9989;";
    li.appendChild(checkBtn);
    
    // Create span for todo text
    const textSpan = document.createElement('span');
    textSpan.textContent = todoText;
    li.appendChild(textSpan);

    // Add event listener for check button
    checkBtn.addEventListener('click', function() {
        // Toggle completion status
        li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through';
        // Update localStorage
        const todoIndex = todos.findIndex(t => t.text === todoText);
        if (todoIndex !== -1) {
            todos[todoIndex].completed = li.style.textDecoration === 'line-through';
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    });

    // Create edit button
    var editBtn = document.createElement('button');
    editBtn.innerHTML = "&#9997;";
    li.appendChild(editBtn);
    editBtn.addEventListener('click', function() {
        EditTodo(li, todoText, description);
    });

    // Create delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "&#128465;"; // trash can icon
    li.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', function () {
        // DeleteTodo(li);
        if (confirm("Are you sure you want to delete this todo?")) {
            RemoveTodo(li, todoText);
        }
    });

    
    // Append to list and update storage
    todolist.appendChild(li);
    // todos.push({text: todoText, description: description, completed: completed});
    // localStorage.setItem('todos', JSON.stringify(todos));
    inputfield.value = '';
}

function EditTodo(li, todoText, description)
{
    console.log(li);
    //Removes the current todo and places its text in the input field for editing
    modaltitle.innerHTML = "Edit Todo";
    const textSpan = li.querySelector('span');
    modal.style.display = "flex";
    inputfield.value = todoText;
    descfield.value = description;
    
    inputfield.focus();
    
    //RemoveTodo(li, todoText);
}

function RemoveTodo(li, todoText)
{
    todolist.removeChild(li);
    const todoIndex = todos.findIndex(t => t.text === todoText);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        console.log(todos);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

init();