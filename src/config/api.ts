const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Configure this per environment with VITE_API_BASE_URL. The fallback keeps
// local development working without an environment file.
export const API_BASE_URL = (configuredBaseUrl || "http://localhost:8080").replace(/\/+$/, "");
