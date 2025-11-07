// src/module-2/hooks/useAuth.ts
import { useState, useEffect } from 'react';
// Use type-only imports for types
import type { User, AuthState } from '../types/index';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token validity
      setAuthState(prev => ({ ...prev, loading: false }));
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (mobile: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      
      return data;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};