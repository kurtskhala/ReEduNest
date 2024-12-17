import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class Permission implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const permissions = {
      admin: ['GET', 'POST', 'PUT', 'DELETE'],
      editor: ['GET', 'POST', 'PUT'],
      viewer: ['GET'],
    };

    if (
      !permissions[request.headers['role'] as string].includes(request.method)
    ) {
      throw new UnauthorizedException('Role is not provided');
    }

    return true;
  }
}
