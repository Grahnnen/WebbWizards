const inputfield = document.getElementById('new-todo-input');
const addbtn = document.getElementById('add-todo-btn');
const todolist = document.getElementById('ulList');
const useroutput = document.getElementById('useroutput');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

const savebtn = document.getElementById('save-todo-btn');
const todoError = document.getElementById('todo-error');
const removebtn = document.getElementById('remove-todo-btn');

// Track the currently edited todo element
let editingTodoElement = null;
const modaltitle = document.getElementById('modal-title');
const descfield = document.getElementById('new-todo-desc');

let todos = [];

// Remove todo when clicking remove button in modal
removebtn.addEventListener('click', function() {
    if (editingTodoElement) {
        const textSpan = editingTodoElement.querySelector('span');
        const todoText = textSpan ? textSpan.textContent : editingTodoElement.textContent.replace('✅', '').replace('✎', '').trim();
        RemoveTodo(editingTodoElement, todoText);
        editingTodoElement = null;
        modal.style.display = "none";
        removebtn.style.display = 'none';
    }
});

//initialize and add all todos from localStorage
function init() {

    todolist.innerHTML = '';
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    todos = storedTodos || [];

    console.log(storedTodos);
    if (storedTodos) {
        storedTodos.forEach(function(todo) {
            AddTodo(todo.text, todo.completed, todo.description);
        });
    }
}

//Open Add Todo Modal
addbtn.addEventListener('click', function() {
    inputfield.value = '';
    modal.style.display = "block";
    removebtn.style.display = 'none';
    editingTodoElement = null;
    inputfield.focus();
    modaltitle.innerHTML = "Add Todo";
    modal.style.display = "flex";
});
//Save Todo from Modal
savebtn.addEventListener('click', function() { //check if merge work
    const todoText = inputfield.value.trim();
    const todoDesc = descfield.value.trim();
    const todoIndex = todos.findIndex(t => t.text === todoText);

    if (todoText === '') {
        todoError.textContent = 'Du måste ange en todo.';
        inputfield.setAttribute('aria-invalid', 'true');
        inputfield.focus();
        return;
    }

    todoError.textContent = ''; 
    inputfield.removeAttribute('aria-invalid');

    if (todoIndex === -1) {
        AddTodo(todoText, false, todoDesc);
        todos.push({text: todoText, description: todoDesc, completed: false});
        useroutput.innerHTML = "<p style='color:green'>Todo was added!</p>";
    } else {
        todos[todoIndex].description = todoDesc;
        useroutput.innerHTML = "<p style='color:green'>Todo was updated!</p>";
    }

    localStorage.setItem('todos', JSON.stringify(todos));
    inputfield.value = ""; 
    descfield.value = "";
    modal.style.display = "none";
    todolist.innerHTML = '';
    init();
});
// Remove duplicate savebtn event listener and merge logic into one handler below
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

//Save Todo from Modal
savebtn.addEventListener('click', function() {
    const todoText = inputfield.value.trim();
    const todoDesc = descfield.value.trim();
    if (todoText === '') {
        alert("Todo cannot be empty!");
        return;
    }
    if (editingTodoElement) {
        // Edit mode: update the existing todo
        const textSpan = editingTodoElement.querySelector('span');
        if (textSpan) {
            // Update text in UI
            textSpan.textContent = todoText;
        }
        // Update in todos array and localStorage
        const oldText = editingTodoElement.dataset.oldText;
        const todoIndex = todos.findIndex(t => t.text === oldText);
        if (todoIndex !== -1) {
            todos[todoIndex].text = todoText;
            todos[todoIndex].description = todoDesc;
            localStorage.setItem('todos', JSON.stringify(todos));
        }
        editingTodoElement = null;
        useroutput.innerHTML = "<p style='color:green'>Todo was updated!</p>";
    } else {
        // Add mode: add new todo if not duplicate
        const todoIndex = todos.findIndex(t => t.text === todoText);
        if (todoIndex === -1) {
            AddTodo(todoText, false, todoDesc);
            todos.push({text: todoText, description: todoDesc, completed: false});
            localStorage.setItem('todos', JSON.stringify(todos));
            useroutput.innerHTML = "<p style='color:green'>Todo was added!</p>";
        } else {
            alert("Todo cannot be duplicate!");
            return;
        }
    }
    inputfield.value = '';
    descfield.value = '';
    modal.style.display = "none";
    removebtn.style.display = 'none';
    todolist.innerHTML = '';
    init();
});


function AddTodo(todoText, completed = false) {
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
        li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through';
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
        EditTodo(li);
    });
    // Create delete button
    var deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "&#128465;"; // trash can icon
    li.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', function () {
        if (confirm("Are you sure you want to delete this todo?")) {
            RemoveTodo(li, todoText);
        }
    });
    todolist.appendChild(li);
    inputfield.value = '';
}

function EditTodo(li) {
    const textSpan = li.querySelector('span');
    const todoText = textSpan ? textSpan.textContent : li.textContent.replace('✅', '').replace('✎', '').trim();
    // Find the todo in the array to get its description
    const todoIndex = todos.findIndex(t => t.text === todoText);
    let todoDesc = '';
    if (todoIndex !== -1) {
        todoDesc = todos[todoIndex].description || '';
    }
    modal.style.display = "block";
    removebtn.style.display = 'block';
    modaltitle.innerHTML = "Edit Todo";
    modal.style.display = "flex";
    inputfield.value = todoText;
    descfield.value = todoDesc;
    inputfield.focus();
    editingTodoElement = li;
    editingTodoElement.dataset.oldText = todoText;
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