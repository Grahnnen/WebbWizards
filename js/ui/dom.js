

// this is the file where we will store all our DOM element references for easy access across the app
export const dom = {
  inputfield: document.getElementById('new-todo-input'),
  descfield: document.getElementById('new-todo-desc'),

  addbtn: document.getElementById('add-todo-btn'),
  savebtn: document.getElementById('save-todo-btn'),
  removebtn: document.getElementById('remove-todo-btn'),

  todolist: document.getElementById('ulList'),
  useroutput: document.getElementById('useroutput'),
  todoError: document.getElementById('todo-error'),

  modal: document.getElementById('myModal'),
  closeBtn: document.getElementsByClassName('close')[0],
  modaltitle: document.getElementById('modal-title'),
};
