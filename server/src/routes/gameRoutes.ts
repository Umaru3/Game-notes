import { Router } from 'express';
import { GameController } from '../controllers/gameController';

export function createGameRouter(controller: GameController) {
  const router = Router();
  router.get('/', controller.getGames);
  router.post('/', controller.createGame);
  router.patch('/:id', controller.updateGameStatus);
  router.delete('/:id', controller.deleteGame);
  return router;
}
