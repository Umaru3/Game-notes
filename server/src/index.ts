import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamechecklist';

app.use(cors());
app.use(express.json());

const client = new MongoClient(mongoUri);

async function main() {
  await client.connect();
  const db = client.db();
  const games = db.collection('games');

  app.get('/api/games', async (req, res) => {
    const all = await games.find().toArray();
    res.json(all);
  });

  app.post('/api/games', async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }
    const doc = await games.insertOne({ name, status: 'new' });
    res.status(201).json({ ...doc, id: doc.insertedId });
  });

  app.patch('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['new', 'backlog', 'ongoing', 'finished'].includes(status)) {
      return res.status(400).json({ message: 'invalid status' });
    }
    const result = await games.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { status } }, { returnDocument: 'after' });
    if (!result.value) return res.status(404).json({ message: 'not found' });
    res.json(result.value);
  });

  app.delete('/api/games/:id', async (req, res) => {
    const { id } = req.params;
    const result = await games.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'not found' });
    res.sendStatus(204);
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
