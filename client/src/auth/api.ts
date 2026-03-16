import { AuthResponse } from './types';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function registerUser(username: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    throw new Error(await res.text() || 'Register failed');
  }
  return res.json();
}

export async function loginUser(usernameOrEmail: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password }),
  });
  if (!res.ok) {
    throw new Error(await res.text() || 'Login failed');
  }
  return res.json();
}
