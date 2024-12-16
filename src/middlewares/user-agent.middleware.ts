import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.headers['user-agent'];
    console.log(userAgent);
    
    const isDesktop =
      /(Windows|Macintosh|Linux)/i.test(userAgent) &&
      !/Mobile|Android|iPhone|iPad|iPod|webOS/i.test(userAgent);

    if (!isDesktop) {
      return res
        .status(403)
        .json({ message: 'Requests from non-desktop devices are not allowed' });
    }

    next();
  }
}
