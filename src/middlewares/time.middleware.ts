import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 24) {
      next();
    } else {
      console.log('Access denied');
      return res
        .status(403)
        .json({ message: 'Access is only allowed between 1 AM and 6 AM.' });
    }
  }
}
