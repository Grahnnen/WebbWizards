
// this is the file where we will store our global state for the app, 
// such as the list of todos and any other relevant data that needs to be accessed across different modules

export const state = {
  todos: [],
  editingTodoElement: null,
  selectedDate: 'all', //Keeps track of the currently selected date for filtering todos, default is 'all' to show all todos
  loading: false, // Indicates whether the app is currently loading data, used to show loading indicators and prevent multiple simultaneous operations
  isLoggedIn: false, // Indicates whether a user is currently logged in
  token: null // Stores the authentication token for the logged-in user, used for making authenticated API requests
};

export function setSelectedDate(newDate) {
  state.selectedDate = newDate;
};

export function loadingState(loading) {
  state.loading = loading;
}

export function loginState(isLoggedIn, token = null) {
  state.isLoggedIn = isLoggedIn;
  state.token = token;
}