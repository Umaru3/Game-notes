import { Collection, ObjectId } from 'mongodb';

export type GameStatus = 'new' | 'backlog' | 'ongoing' | 'finished';
export interface GameItem {
  _id?: ObjectId;
  name: string;
  status: GameStatus;
}

export class GameService {
  constructor(private games: Collection<GameItem>) {}

  findAll() {
    return this.games.find().toArray();
  }

  create(name: string) {
    return this.games.insertOne({ name, status: 'new' });
  }

  updateStatus(id: string, status: GameStatus) {
    return this.games.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' }
    );
  }

  delete(id: string) {
    return this.games.deleteOne({ _id: new ObjectId(id) });
  }
}
