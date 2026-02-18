import { state, setSelectedDate } from './state.js';
import { loadTodos } from './storage/todoStorage.js';
import { renderTodos } from './ui/todoList.js';
import { setupModal } from './ui/modal.js';
import { initDom } from './ui/dom.js';


//Register serviceworker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    console.log(navigator.serviceWorker.controller ? "SW controlling ✅" : "Not controlled ❌");

  });
}

// this is the main entry point for our app, where we will initialize the state,
//  load todos from storage, and set up the UI components such as the todo list and modal

document.addEventListener('DOMContentLoaded', () => {
  initDom();
  state.todos = loadTodos();
  renderTodos();
  setupModal();

  //Date selection logic
  const dateTrigger = document.querySelector('#today-heading');
  const dateList = document.querySelector('#date-list');

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
  
});


