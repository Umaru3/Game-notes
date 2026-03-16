import React, { useState } from 'react';
import { useAuth } from './AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const { login, error } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(usernameOrEmail, password);
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} placeholder="Username or email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Log in</button>
      </form>
      <button onClick={onSwitchToRegister}>Create account</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
