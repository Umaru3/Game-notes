import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { GameService, GameItem } from './services/gameService';
import { GameController } from './controllers/gameController';
import { createGameRouter } from './routes/gameRoutes';
import { AuthService, UserItem } from './services/authService';
import { authMiddleware } from './middleware/authMiddleware';
import { AuthController } from './controllers/authController';
import { createAuthRouter } from './routes/authRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamechecklist';

app.use(cors());
app.use(express.json());

const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function main() {
  await client.connect();
  await client.db('admin').command({ ping: 1 });
  console.log('Pinged your MongoDB deployment successfully.');
  const db = client.db();
  const gamesCollection = db.collection<GameItem>('games');
  const usersCollection = db.collection<UserItem>('users');

  const gameService = new GameService(gamesCollection);
  const gameController = new GameController(gameService);
  app.use('/api/games', authMiddleware, createGameRouter(gameController));

  const authService = new AuthService(usersCollection);
  const authController = new AuthController(authService);
  app.use('/api/auth', createAuthRouter(authController));

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
