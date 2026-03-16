import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

type GameStatus = 'new' | 'backlog' | 'ongoing' | 'finished';

interface GameItem {
  id: string;
  name: string;
  status: GameStatus;
}

const statusOrder: GameStatus[] = ['new', 'backlog', 'ongoing', 'finished'];

function App() {
  const [games, setGames] = useState<GameItem[]>(() => {
    const stored = localStorage.getItem('gameChecklist');
    if (!stored) return [];
    try {
      return JSON.parse(stored) as GameItem[];
    } catch {
      return [];
    }
  });
  const [newGame, setNewGame] = useState('');

  useEffect(() => {
    localStorage.setItem('gameChecklist', JSON.stringify(games));
  }, [games]);

  const grouped = useMemo(() => {
    return statusOrder.map((status) => ({ status, items: games.filter((g) => g.status === status) }));
  }, [games]);

  const addGame = () => {
    const name = newGame.trim();
    if (!name) return;
    setGames((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, status: 'new' as GameStatus },
    ]);
    setNewGame('');
  };

  const removeGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const advanceStatus = (game: GameItem) => {
    const nextIndex = statusOrder.indexOf(game.status) + 1;
    if (nextIndex >= statusOrder.length) return;
    const nextStatus = statusOrder[nextIndex];
    setGames((prev) => prev.map((g) => (g.id === game.id ? { ...g, status: nextStatus } : g)));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Game Checklist</h1>
        <p>Theme: SaaS invoice-style game task tracking (new → backlog → ongoing → finished).</p>
      </header>

      <section className="add-game-form">
        <input
          value={newGame}
          onChange={(e) => setNewGame(e.target.value)}
          placeholder="Add a game title"
          aria-label="Game title"
        />
        <button onClick={addGame} disabled={!newGame.trim()}>
          Add Game
        </button>
      </section>

      <div className="status-board">
        {grouped.map(({ status, items }) => (
          <div key={status} className="status-column">
            <h2>{status.toUpperCase()}</h2>
            {items.length === 0 && <p>No games yet.</p>}
            <ul>
              {items.map((game) => (
                <li key={game.id}>
                  <span>{game.name}</span>
                  <button onClick={() => advanceStatus(game)} disabled={game.status === 'finished'}>
                    {game.status === 'finished' ? 'Done' : 'Next'}
                  </button>
                  <button onClick={() => removeGame(game.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
