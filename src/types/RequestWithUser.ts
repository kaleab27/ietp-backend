import { Request as ExpressRequest } from 'express';
import { User } from '../models/types'; // Adjust path based on your structure

export interface RequestWithUser extends ExpressRequest {
  user?: User; // Add the optional user property
}
