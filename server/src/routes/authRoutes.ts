import { Router } from 'express';
import { AuthController } from '../controllers/authController';

export function createAuthRouter(controller: AuthController) {
  const router = Router();
  router.post('/register', controller.register);
  router.post('/login', controller.login);
  return router;
}
