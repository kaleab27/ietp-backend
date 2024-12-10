// src/types/express.d.ts
import { User } from '../models/types'; // Adjust the relative path to models/types

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the `user` property to the Request type
    }
  }
}
