
import React, { createContext, useState, useContext, useEffect } from "react";

type UserRole = "teacher" | "student";

interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  joinAsStudent: (name: string, sessionCode: string) => Promise<{sessionId: string, studentId: string}>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data in localStorage
    const storedUser = localStorage.getItem("quizUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, validate credentials against backend
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0], // Just use part of email as name for mock
      email,
      role
    };
    
    setUser(mockUser);
    localStorage.setItem("quizUser", JSON.stringify(mockUser));
    setLoading(false);
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, send registration data to backend
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role
    };
    
    setUser(mockUser);
    localStorage.setItem("quizUser", JSON.stringify(mockUser));
    setLoading(false);
  };

  // Join as a student without full account
  const joinAsStudent = async (name: string, sessionCode: string) => {
    setLoading(true);
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, validate session code against backend
    const sessionId = Math.random().toString(36).substring(2, 9);
    const studentId = Math.random().toString(36).substring(2, 9);
    
    const studentUser: User = {
      id: studentId,
      name,
      role: "student"
    };
    
    setUser(studentUser);
    localStorage.setItem("quizUser", JSON.stringify(studentUser));
    setLoading(false);
    
    return { sessionId, studentId };
  };

  // Mock reset password function
  const resetPassword = async (email: string) => {
    setLoading(true);
    
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, send reset password request to backend
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quizUser");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, joinAsStudent, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
