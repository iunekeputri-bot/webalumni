import { useState, useEffect } from "react";
import { API_URL } from "../config/api";

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

    // Check maintenance status only on component mount to reduce API load
    checkMaintenanceMode();
  }, []);

  return { isMaintenanceMode, isChecking };
};
