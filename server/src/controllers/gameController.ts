import { Request, Response } from 'express';
import { GameService, GameStatus } from '../services/gameService';

export class GameController {
  constructor(private gameService: GameService) {}

  getGames = async (req: Request, res: Response) => {
    const all = await this.gameService.findAll();
    res.json(all);
  };

  createGame = async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const result = await this.gameService.create(name);
    res.status(201).json({ id: result.insertedId, name, status: 'new' });
  };

  updateGameStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const valid: GameStatus[] = ['new', 'backlog', 'ongoing', 'finished'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'invalid status' });

    const result = await this.gameService.updateStatus(id, status);
    if (!result.value) return res.status(404).json({ message: 'not found' });
    res.json(result.value);
  };

  deleteGame = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.gameService.delete(id);
    if (result.deletedCount === 0) return res.status(404).json({ message: 'not found' });
    res.sendStatus(204);
  };
}
