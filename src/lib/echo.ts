import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher available globally for Echo
(window as any).Pusher = Pusher;

// Get token with fallback
const getToken = () => localStorage.getItem("token") || "";

// WebSocket configuration for Reverb - ENABLED
const echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint: `http://${window.location.hostname}:8000/api/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/json",
    },
  },
});

// Helper function to update auth token
export const updateEchoToken = (token: string) => {
  if (echo && echo.connector && echo.connector.pusher) {
    const pusher = echo.connector.pusher;
    if (!pusher.config) pusher.config = {};
    if (!pusher.config.auth) pusher.config.auth = {};
    if (!pusher.config.auth.headers) pusher.config.auth.headers = {};
    pusher.config.auth.headers.Authorization = `Bearer ${token}`;
  }
};

export default echo;
