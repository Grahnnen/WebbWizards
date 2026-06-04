import { loginState } from '../state.js';
import { ENV } from '../env.js'; // Update this to match your backend URL and port
export function initLogin(renderApp) {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) {
    console.error('Login form not found');
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!username || !password) {
      alert('Username and password are required');
      return;
    }
    try {
      const response = await fetch(`${ENV.API_BACKEND_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed, please check your username and password and try again.');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        loginState(true, data.token);
        renderApp();
      } else {
        throw new Error('Login failed, no token received.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || "Something went wrong during login.");
    }
  });
}