const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackBaseUrl = import.meta.env.DEV
  ? "http://localhost:8080"
  : "http://13.53.131.237:8080";

// Prefer an explicit environment variable, but fall back to the correct value for
// the current build mode. This keeps the API URL loosely coupled from the app code.
export const API_BASE_URL = (configuredBaseUrl || fallbackBaseUrl).replace(/\/+$/, "");
