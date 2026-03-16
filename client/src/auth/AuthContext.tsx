import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { AuthResponse } from './types';
import { loginUser, registerUser } from './api';

type AuthContextType = {
  token: string | null;
  user: { username: string; email: string } | null;
  error: string | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'gamechecklist_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [token]);

  const login = async (usernameOrEmail: string, password: string) => {
    setError(null);
    try {
      const result: AuthResponse = await loginUser(usernameOrEmail, password);
      setToken(result.token);
      setUser(result.user);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setError(null);
    try {
      const result: AuthResponse = await registerUser(username, email, password);
      setToken(result.token);
      setUser(result.user);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  const value = useMemo(
    () => ({ token, user, error, isAuthenticated: Boolean(token), login, register, logout }),
    [token, user, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
