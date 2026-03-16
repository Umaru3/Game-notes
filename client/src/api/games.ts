import { GameItem, GameStatus } from '../auth/types';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const makeOptions = (token?: string, method = 'GET', body?: object) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options: RequestInit = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return options;
};

export async function fetchGames(token?: string): Promise<GameItem[]> {
  const res = await fetch(`${API_BASE}/api/games`, makeOptions(token));
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}

export async function createGame(name: string, token?: string): Promise<GameItem> {
  const res = await fetch(`${API_BASE}/api/games`, makeOptions(token, 'POST', { name }));
  if (!res.ok) throw new Error('Failed to create game');
  return res.json();
}

export async function updateGameStatus(id: string, status: GameStatus, token?: string): Promise<GameItem> {
  const res = await fetch(`${API_BASE}/api/games/${id}`, makeOptions(token, 'PATCH', { status }));
  if (!res.ok) throw new Error('Failed to update game status');
  return res.json();
}

export async function deleteGame(id: string, token?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/games/${id}`, makeOptions(token, 'DELETE'));
  if (!res.ok) throw new Error('Failed to delete game');
}
