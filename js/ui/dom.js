

// this is the file where we will store all our DOM element references for easy access across the app
export const dom = {}
export function initDom() {
  dom.inputfield = document.getElementById('new-todo-input');
  dom.descfield = document.getElementById('new-todo-desc');
  dom.dueDate = document.getElementById('new-todo-due-date');

  dom.addbtn = document.getElementById('add-todo-btn');
  dom.savebtn = document.getElementById('save-todo-btn');
  dom.removebtn = document.getElementById('remove-todo-btn');

  dom.todolist = document.getElementById('ulList');
  dom.importantList = document.getElementById('importantList');
  dom.useroutput = document.getElementById('useroutput');
  dom.todoError = document.getElementById('todo-error');

  dom.modal = document.getElementById('myModal');
  dom.closeBtn = document.getElementsByClassName('close')[0];
  dom.modaltitle = document.getElementById('modal-title');
};
