const inputfield = document.getElementById('new-todo-input');
const addbtn = document.getElementById('add-todo-btn');
const todolist = document.getElementById('ulList');
const useroutput = document.getElementById('useroutput');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const savebtn = document.getElementById('save-todo-btn');
const todoError = document.getElementById('todo-error');

const todos = [];

//initialize and add all todos from localStorage
function init() {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
        storedTodos.forEach(function(todo) {
            AddTodo(todo.text, todo.completed);
        });
    }
}

//Open Add Todo Modal
addbtn.addEventListener('click', function() {
    const todoText = inputfield.value.trim();

    modal.style.display = "block"
});
//Save Todo from Modal
savebtn.addEventListener('click', function() {
    const todoText = inputfield.value.trim();
    if (todoText !== '') {
        AddTodo(todoText);
        modal.style.display = "none";

        todoError.textContent = '';
        inputfield.removeAttribute('aria-invalid');
    } else {
        todoError.textContent = 'Du måste ange en todo.';
        inputfield.setAttribute('aria-invalid', 'true');
        inputfield.focus();
    }
});
//Close Modal
span.onclick = function() {
  modal.style.display = "none";
}
//Close Modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function AddTodo(todoText, completed = false)
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
        EditTodo(li);
    });
    
    // Append to list and update storage
    todolist.appendChild(li);
    todos.push({text: todoText, completed: completed});
    localStorage.setItem('todos', JSON.stringify(todos));
    inputfield.value = '';
}

function EditTodo(li)
{
    //Removes the current todo and places its text in the input field for editing
    const textSpan = li.querySelector('span');
    const todoText = textSpan ? textSpan.textContent : li.textContent.replace('✅', '').replace('✎', '').trim();
    modal.style.display = "block"
    inputfield.value = todoText;
    inputfield.focus();
    
    RemoveTodo(li, todoText);
}

function RemoveTodo(li, todoText)
{
    todolist.removeChild(li);
    const todoIndex = todos.findIndex(t => t.text === todoText);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}


init();