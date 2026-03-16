import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; username: string; email?: string };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    req.user = { id: payload.id, username: payload.username };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
