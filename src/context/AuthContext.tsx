import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";
import { DEMO_CREDENTIALS } from "@/config/demoCredentials";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const validateDemoCredentials = (email: string, password: string): User | null => {
    // Check all demo credentials
    const allCredentials = Object.values(DEMO_CREDENTIALS);
    const credential = allCredentials.find((cred) => cred.email === email && cred.password === password);

    if (credential) {
      return {
        id: credential.role === "alumni" ? "1" : credential.role === "company" ? "2" : "3",
        email,
        name: credential.name,
        role: credential.role as UserRole,
        createdAt: new Date(),
      };
    }

    return null;
  };

  const login = async (email: string, password: string, role: UserRole) => {
    // Try demo credentials first
    const demoUser = validateDemoCredentials(email, password);
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem("user", JSON.stringify(demoUser));
      return;
    }

    // Mock login - replace with actual API call
    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      role,
      createdAt: new Date(),
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    // Try demo credentials first
    const demoUser = validateDemoCredentials(email, password);
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem("user", JSON.stringify(demoUser));
      return;
    }

    // Mock signup - replace with actual API call
    const mockUser: User = {
      id: "1",
      email,
      name,
      role,
      createdAt: new Date(),
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
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
