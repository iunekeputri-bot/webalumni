// API Configuration
// This will automatically use the correct host when accessed from different devices

const getApiUrl = () => {
  // Check if we have an environment variable set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Otherwise, use the current hostname with port 8000
  // This allows the app to work when accessed from other devices on the network
  const hostname = window.location.hostname;
  return `http://${hostname}:8000/api`;
};

export const API_URL = getApiUrl();
export const API_BASE = API_URL.replace("/api", "");
