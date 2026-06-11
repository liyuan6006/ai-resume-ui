// Centralized API configuration.
//
// The base URL is driven by the REACT_APP_API_BASE_URL environment variable,
// which Create React App loads automatically from the matching .env file:
//   - `npm start`  -> .env.development  (local: http://127.0.0.1:8000)
//   - `npm run build` -> .env.production (prod: https://api.profile-agent.com)
//
// To override on the fly, set it inline, e.g. on Windows PowerShell:
//   $env:REACT_APP_API_BASE_URL = "http://127.0.0.1:8000"; npm start
//
// The fallback below is used only if no env var is set.
const API_BASE_URL = (
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export const ENDPOINTS = {
    ask: `${API_BASE_URL}/ask`,
    upload: `${API_BASE_URL}/upload`
};

export default API_BASE_URL;
