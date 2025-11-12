// src/context/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Define the shape of the user object (extend as needed)
export interface User {
  name: string;
  businessName: string;
  location: string;
  trialEnd: string; // ISO date string
  // Add other fields as your app evolves (e.g., isSubscribed, plan, etc.)
}

// Define the context type
interface AuthContextType {
  mobile: string;
  setMobile: (mobile: string) => void;
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create context with a default value that matches AuthContextType
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context safely
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobile, setMobile] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        mobile,
        setMobile,
        isVerified,
        setIsVerified,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};