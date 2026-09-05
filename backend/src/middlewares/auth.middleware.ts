import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { isDatabaseConnected } from '../db/connection.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    mobile: string;
    name: string;
    state?: string;
    district?: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow unauthenticated for public requests or fallback to query/body
      return next();
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const parts = token.split('_');

    if (parts.length >= 2 && parts[0] === 'token') {
      const userId = parts[1];
      if (isDatabaseConnected()) {
        const user = await User.findById(userId);
        if (user) {
          req.user = {
            id: String(user._id),
            mobile: user.mobile,
            name: user.name,
            state: user.state,
            district: user.district,
          };
        }
      }
    }

    next();
  } catch {
    next();
  }
};
