const inputfield = document.getElementById('new-todo-input');
const addbtn = document.getElementById('add-todo-btn');
const todolist = document.getElementById('ulList');
const useroutput = document.getElementById('useroutput');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

const savebtn = document.getElementById('save-todo-btn');
const removebtn = document.getElementById('remove-todo-btn');

// Track the currently edited todo element
let editingTodoElement = null;

const todos = [];

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
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
        storedTodos.forEach(function(todo) {
            AddTodo(todo.text, todo.completed);
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

//Save Todo from Modal
savebtn.addEventListener('click', function() {
    const todoText = inputfield.value.trim();
    if (todoText !== '') {
        if (editingTodoElement) {
            // Edit mode: update the existing todo
            const textSpan = editingTodoElement.querySelector('span');
            if (textSpan) {
                // Update text in UI
                textSpan.textContent = todoText;
                // Update in todos array and localStorage
                const oldText = editingTodoElement.dataset.oldText || textSpan.textContent;
                const todoIndex = todos.findIndex(t => t.text === oldText);
                if (todoIndex !== -1) {
                    todos[todoIndex].text = todoText;
                    localStorage.setItem('todos', JSON.stringify(todos));
                }
            }
            editingTodoElement = null;
        } else {
            // Add mode: add new todo
            AddTodo(todoText);
        }
        modal.style.display = "none";
        removebtn.style.display = 'none';
    }
});

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

function EditTodo(li) {
    const textSpan = li.querySelector('span');
    const todoText = textSpan ? textSpan.textContent : li.textContent.replace('✅', '').replace('✎', '').trim();
    modal.style.display = "block";
    removebtn.style.display = 'block';
    inputfield.value = todoText;
    inputfield.focus();
    editingTodoElement = li;
    // Store the old text for reference when saving
    editingTodoElement.dataset.oldText = todoText;
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