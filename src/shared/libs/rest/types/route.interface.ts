import { Middleware } from '../middleware/middleware.interface.js';
import { HttpMethod } from './http-method.enum.js';
import { Request, Response, NextFunction } from 'express';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
