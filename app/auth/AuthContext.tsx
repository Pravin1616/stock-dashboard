import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getAccessToken } from '../services/upstoxService';

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (clientId: string, clientSecret: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = async (clientId: string, clientSecret: string) => {
    setIsLoading(true);
    try {
      const token = await getAccessToken(clientId, clientSecret);
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
    } catch (error) {
      console.error('Login failed:', error);
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      // Rethrow or handle error appropriately for UI
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  };

  const isAuthenticated = !isLoading && !!accessToken;

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
