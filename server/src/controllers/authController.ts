import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username,email,password required' });
    }
    try {
      const user = await this.authService.register(username, email, password);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'usernameOrEmail and password required' });
    }
    try {
      const user = await this.authService.login(usernameOrEmail, password);
      const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { username: user.username, email: user.email } });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}
