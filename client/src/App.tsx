import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { GameItem, GameStatus } from './auth/types';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { createGame, deleteGame, fetchGames, updateGameStatus } from './api/games';

const statusOrder: GameStatus[] = ['new', 'backlog', 'ongoing', 'finished'];

function AppContent() {
  const { token, user, isAuthenticated, logout, error: authError } = useAuth();
  const [games, setGames] = useState<GameItem[]>([]);
  const [newGame, setNewGame] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetchGames(token || undefined)
      .then(setGames)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  const grouped = useMemo(() => statusOrder.map((status) => ({ status, items: games.filter((g) => g.status === status) })), [games]);

  const handleAddGame = async () => {
    const name = newGame.trim();
    if (!name) return;
    try {
      const created = await createGame(name, token || undefined);
      setGames((prev) => [...prev, created]);
      setNewGame('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveGame = async (id: string) => {
    try {
      await deleteGame(id, token || undefined);
      setGames((prev) => prev.filter((g) => g._id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAdvanceStatus = async (game: GameItem) => {
    const nextIndex = statusOrder.indexOf(game.status) + 1;
    if (nextIndex >= statusOrder.length) return;
    const nextStatus = statusOrder[nextIndex];
    try {
      const updated = await updateGameStatus(game._id, nextStatus, token || undefined);
      setGames((prev) => prev.map((g) => (g._id === game._id ? updated : g)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-wrapper">
        <div className={`auth-panel ${showRegister ? '' : 'active'}`}>
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        </div>
        <div className={`auth-panel ${showRegister ? 'active' : ''}`}>
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Simple Game Checklist</h1>
          <div>
            <span style={{ marginRight: '10px' }}>Hello, {user?.username}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <section className="add-game-form">
        <input
          value={newGame}
          onChange={(e) => setNewGame(e.target.value)}
          placeholder="Add a game title"
          aria-label="Game title"
        />
        <button onClick={handleAddGame} disabled={!newGame.trim()}>
          Add Game
        </button>
      </section>

      {error && <div className="error">Error: {error}</div>}
      {authError && <div className="error">Auth error: {authError}</div>}
      {loading ? (
        <div className="status-board">Loading games...</div>
      ) : (
        <div className="status-board">
          {grouped.map(({ status, items }) => (
            <div key={status} className="status-column">
              <h2>{status.toUpperCase()}</h2>
              {items.length === 0 && <p>No games yet.</p>}
              <ul>
                {items.map((game) => (
                  <li key={game._id}>
                    <span>{game.name}</span>
                    <button onClick={() => handleAdvanceStatus(game)} disabled={game.status === 'finished'}>
                      {game.status === 'finished' ? 'Done' : 'Next'}
                    </button>
                    <button onClick={() => handleRemoveGame(game._id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
