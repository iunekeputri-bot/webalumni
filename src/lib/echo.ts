import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher available globally for Echo
(window as any).Pusher = Pusher;

// Get token with fallback
const getToken = () => localStorage.getItem("token") || "";

const echo = new Echo({
  broadcaster: "pusher",
  key: "local-websocket-key",
  cluster: "mt1",
  wsHost: window.location.hostname,
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  disableStats: true,
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
