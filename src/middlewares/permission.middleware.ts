import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const permission = req.headers['permission'];
    const methodPermissions = {
      POST: 'create',
      DELETE: 'delete',
      GET: 'read',
      PUT: 'update',
    };

    const requestMethod = methodPermissions[req.method];

    if (permission !== requestMethod) {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    next();
  }
}
