import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface MaintenanceInfo {
  enabled: boolean;
  end_date?: string;
  end_time?: string;
  message?: string;
}

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  maintenanceInfo: MaintenanceInfo | null;
  isChecking: boolean;
  setMaintenanceMode: (enabled: boolean) => void;
  setMaintenanceInfo: (info: MaintenanceInfo) => void;
  refreshMaintenanceStatus: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceInfo, setMaintenanceInfoState] = useState<MaintenanceInfo | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const refreshMaintenanceStatus = async () => {
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
        setMaintenanceInfoState(data);
      }
    } catch (error) {
      console.error("Error checking maintenance mode:", error);
      setIsMaintenanceMode(false);
      setMaintenanceInfoState(null);
    } finally {
      setIsChecking(false);
    }
  };

  const setMaintenanceMode = (enabled: boolean) => {
    setIsMaintenanceMode(enabled);
  };

  const setMaintenanceInfo = (info: MaintenanceInfo) => {
    setIsMaintenanceMode(info.enabled);
    setMaintenanceInfoState(info);
  };

  useEffect(() => {
    refreshMaintenanceStatus();

    // Check maintenance status every 30 seconds
    const interval = setInterval(refreshMaintenanceStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        maintenanceInfo,
        isChecking,
        setMaintenanceMode,
        setMaintenanceInfo,
        refreshMaintenanceStatus,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
};
