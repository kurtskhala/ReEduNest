import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { Observable } from 'rxjs';
  
  export class HasUser implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request: Request & { userId: number } = context
        .switchToHttp()
        .getRequest();
      const userId = request.headers['userid'];
      if (!userId) {
        throw new HttpException('ar aris id', HttpStatus.UNAUTHORIZED);
      }
      request.userId = Number(userId);
      return true;
    }
  }
  