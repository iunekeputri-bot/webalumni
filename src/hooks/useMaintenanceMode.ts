import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const useMaintenanceMode = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch(`${API_URL}/maintenance-status`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsMaintenanceMode(data.maintenance_mode || false);
        }
      } catch (error) {
        console.error("Error checking maintenance mode:", error);
        // On error, assume not in maintenance mode
        setIsMaintenanceMode(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkMaintenanceMode();

    // Check maintenance status every 30 seconds
    const interval = setInterval(checkMaintenanceMode, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isMaintenanceMode, isChecking };
};
