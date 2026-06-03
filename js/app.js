import { state, setSelectedDate, loginState } from './state.js';
import { initLogin } from './ui/login.js';
import { loadTodos } from './storage/todoStorage.js';
import { renderTodos } from './ui/todoList.js';
import { setupModal } from './ui/modal.js';
import { dom, initDom } from './ui/dom.js';

//Register serviceworker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("./sw.js", { scope: "./" });
    console.log(navigator.serviceWorker.controller ? "SW controlling ✅" : "Not controlled ❌");

  });
}

async function startApp() {
  // Initialize DOM references
  console.log("1. startApp har kickat igång!");
  initDom();
  console.log("2. initDom är körd. dom.loginmodal är:", dom.loginmodal);

  //check if we have a saved token in localStorage to determine if the user is already logged in
 const savedToken = localStorage.getItem('jwtToken');
 console.log("3. savedToken i localStorage är:", savedToken);
  if (savedToken) {
    loginState(true, savedToken);
  }
  console.log("4. state.isLoggedIn är just nu:", state.isLoggedIn);
  //Control login modal visibility based on login state
  if (!state.isLoggedIn) {
    console.log("5. Vi är i IF-blocket (INTE inloggad). Försöker sätta display till flex.");
    if (dom.loginmodal) {
      dom.loginmodal.style.display = 'flex';
      console.log("6. display=flex har satts på elementet!");
    } else {
      console.log("6. FEL: dom.loginmodal saknas när vi ska sätta display!");      
    }     
    //initialize login form logic
    initLogin(startApp);
  } else {
    console.log("5. Vi är i ELSE-blocket (ÄR inloggad). Gömmer modal.");    
    // Hide login modal if logged in
    dom.loginmodal.style.display = 'none';
    console.log("We are logged in!");
    await initializeApp();
  }
}

async function initializeApp() {
  generateDateOptions();
  state.todos = await loadTodos();
  renderTodos();
  setupModal();
  setupDateDropdownListeners();
}

//Start the app
document.addEventListener('DOMContentLoaded', startApp)
// this is the main entry point for our app, where we will initialize the state,
//  load todos from storage, and set up the UI components such as the todo list and modal

// Helper functions for date formatting
function getFormattedDate(date) {
    return date.toISOString().split('T')[0];
}

function getDisplayDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
}

function generateDateOptions() {
  const dateList = document.getElementById('date-list');
  dateList.innerHTML = '';
  const allLi = document.createElement('li');
  allLi.textContent = 'Show All';
  allLi.dataset.dueDate = 'all';
  allLi.tabIndex = 0;
  allLi.role = 'button';
  dateList.appendChild(allLi);

  // Generate options for today and the next 3 days
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateString = getFormattedDate(date);
    let displayStr = getDisplayDate(date);

    //Add Today, Tomorrow etc. for the first few options
    if (i === 0) displayStr = `Today (${displayStr})`;
    else if (i === 1) displayStr = `Tomorrow (${displayStr})`;
    else if (i === 2) displayStr = `Upcoming (${displayStr})`;

    const li = document.createElement('li');
    li.textContent = displayStr;
    li.dataset.dueDate = dateString;
    li.tabIndex = 0;
    li.role = 'button';
    dateList.appendChild(li);
  }
}
function setupDateDropdownListeners() {
  //Date selection logic
  const dateTrigger = document.querySelector('#today-heading');
  const dateList = document.querySelector('#date-list');

  if (!dateTrigger || !dateList) return;
  
  dateTrigger.addEventListener('click', () => {
    dateList.classList.toggle('hidden');
    // Make all date options focusable with Tab when the date list is visible
    if (!dateList.classList.contains('hidden')) {
      Array.from(dateList.querySelectorAll('li')).forEach(li => li.tabIndex = 0);
    }
  });


  dateList.addEventListener('click', (e) => {
    // check if the clicked element is an <li> (a date option)
    if (e.target.tagName === 'LI') {
      const selectedDateValue = e.target.dataset.dueDate;
      const selectedDateText = e.target.textContent;

      // Update the global state with the selected date
      setSelectedDate(selectedDateValue);
      dateTrigger.innerHTML = `${selectedDateText} <span class="arrow">▼</span>`;
      dateList.classList.add('hidden');
      // Re-render the todo list to reflect the new date filter
      renderTodos();
    }
  });

  dateTrigger.tabIndex = 0;

  dateTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      dateList.classList.toggle('hidden');
    }
  });

  dateList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'LI') {
      e.target.click();
    }
  });
  
};


