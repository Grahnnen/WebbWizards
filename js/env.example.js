// env.example.js - Template for team members to set up their local environment.
// // Do NOT put local ports or secrets here.

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const ENV = {
    API_BACKEND_BASE_URL: isLocalhost 
        ? "http://localhost:XXXX" 
        : "https://XXXXXX.azurecontainerapps.io",

    API_BACKEND_TODO_BASE_URL: isLocalhost 
        ? "https://localhost:XXXX" 
        : "https://XXXXXX.azurecontainerapps.io"
}; 
