
// this is the file where we will store our global state for the app, 
// such as the list of todos and any other relevant data that needs to be accessed across different modules

export const state = {
  todos: [],
  editingTodoElement: null,
  selectedDate: 'all', //Keeps track of the currently selected date for filtering todos, default is 'all' to show all todos
};

export function setSelectedDate(newDate) {
  state.selectedDate = newDate;
}
