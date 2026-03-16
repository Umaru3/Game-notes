export type GameStatus = 'new' | 'backlog' | 'ongoing' | 'finished';

export interface GameItem {
  _id: string;
  name: string;
  status: GameStatus;
}

export interface AuthResponse {
  token: string;
  user: {
    username: string;
    email: string;
  };
}
