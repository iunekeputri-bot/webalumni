import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
    console.log("AuthContext: Initial load complete, user:", storedUser ? JSON.parse(storedUser).name : "null");
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Ensure CSRF cookie for Sanctum (prevents 419 CSRF token mismatch)
      try {
        // Sanctum CSRF cookie endpoint must be requested at the root path
        // (not behind the `/api` proxy). Requesting `/sanctum/csrf-cookie`
        // ensures the cookie is set for same-origin requests.
        await fetch(`/sanctum/csrf-cookie`, { credentials: "include" });
      } catch (e) {
        console.debug("Warning: failed to fetch CSRF cookie", e);
      }

      // Read XSRF-TOKEN cookie and set header for fetch (fetch doesn't set it automatically)
      const xsrfRaw = typeof document !== "undefined"
        ? document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="))?.split("=")[1]
        : undefined;
      const xsrf = xsrfRaw ? decodeURIComponent(xsrfRaw) : "";

      // API login (works with both demo and real users)
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-XSRF-TOKEN": xsrf,
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const user: User = {
          id: data.user.id.toString(),
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          createdAt: new Date(data.user.created_at),
        };

        // Store in localStorage first
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", data.token);

        // Then update state - this triggers useEffect in auth pages
        setUser(user);
      } else {
        const errorData = await response.json();
        console.error("Login error:", errorData);
        throw new Error(errorData.message || "Login failed");
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      // Small delay before setting loading to false to allow navigation to start
      setTimeout(() => {
        setIsLoading(false);
      }, 50);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    // Ensure CSRF cookie for Sanctum when registering
    try {
      await fetch(`/sanctum/csrf-cookie`, { credentials: "include" });
    } catch (e) {
      console.debug("Warning: failed to fetch CSRF cookie for register", e);
    }

    // API signup
    const xsrfRaw = typeof document !== "undefined"
      ? document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="))?.split("=")[1]
      : undefined;
    const xsrf = xsrfRaw ? decodeURIComponent(xsrfRaw) : "";

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": xsrf,
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
      const data = await response.json();
      const user: User = {
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        createdAt: new Date(data.user.created_at),
      };
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", data.token);
    } else {
      throw new Error("Signup failed");
    }
  };

  const logout = () => {
    console.log("AuthContext: Logging out...");
    navigate("/");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear all user-specific data from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("documents_") || key.startsWith("profile_")) {
        localStorage.removeItem(key);
      }
    });
    console.log("AuthContext: Logout complete");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
