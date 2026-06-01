import { loginState } from '../state.js';

export function initLogin(renderApp) {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    localStorage.setItem('jwtToken', 'mocked-jwt-token');
    loginState(true, 'mocked-jwt-token');
    renderApp();
  });
}