import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../types/RequestWithUser';
import { User } from '../models/types';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  if (!authHeader ) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }

  // Extract the token from the "Bearer <token>" format
  const token = authHeader;

  try {
    const decoded = jwt.verify(token, 'default_secret') as User;
    req.user = decoded;
    console.log(decoded) // Attach the decoded user data to the request
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
