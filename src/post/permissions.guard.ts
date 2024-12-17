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
export class IsViewer implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers['role'])
      throw new BadRequestException('Role is not provided');
    const roles = ['admin', 'editor', 'viewer'];
    if (!roles.includes(request.headers['role'] as string))
      throw new UnauthorizedException('Role is not provided');

    return true;
  }
}
@Injectable()
export class IsEditor implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers['role'])
      throw new BadRequestException('Role is not provided');
    const roles = ['admin', 'editor'];
    if (!roles.includes(request.headers['role'] as string))
      throw new UnauthorizedException('Role is not provided');

    return true;
  }
}
@Injectable()
export class IsAdmin implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (!request.headers['role'])
      throw new BadRequestException('Role is not provided');
    const roles = ['admin'];
    if (!roles.includes(request.headers['role'] as string))
      throw new UnauthorizedException('Role is not provided');

    return true;
  }
}

@Injectable()
export class Permission implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const permissions = {
      admin: ['GET', 'POST', 'PATCH', 'DELETE'],
      editor: ['GET', 'POST', 'PATCH'],
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
