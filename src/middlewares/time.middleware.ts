import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentHour = new Date().getHours();
    if (currentHour >= 2 && currentHour < 6) {
      next();
    } else {
      console.log('Access denied');
      return res
        .status(403)
        .json({ message: 'Access is only allowed between 2 AM and 6 AM.' });
    }
  }
}
