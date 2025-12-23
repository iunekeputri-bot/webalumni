// API Configuration
// This will automatically use the correct host when accessed from different devices

const getApiUrl = () => {
  // Check if we have an environment variable set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Otherwise, use the current hostname with port 8000
  // Default to a relative path so the browser will use the same origin
  // and nginx can proxy `/api` to the backend. This avoids calls to
  // the client's localhost:8000 which is usually incorrect in production.
  return `/api`;
};

export const API_URL = getApiUrl();
export const API_BASE = API_URL.replace("/api", "");
