import { useEffect, useMemo, useState } from 'react';
import { AuthResponse } from './types';
import { loginUser, registerUser } from './api';

const STORAGE_KEY = 'gamechecklist_token';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, token);
  }, [token]);

  const login = async (usernameOrEmail: string, password: string) => {
    setError(null);
    try {
      const result: AuthResponse = await loginUser(usernameOrEmail, password);
      setUser(result.user);
      setToken(result.token);
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
      setUser(result.user);
      setToken(result.token);
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

  return useMemo(() => ({ token, user, error, isAuthenticated, login, register, logout }), [token, user, error, isAuthenticated]);
}
