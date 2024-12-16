import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const role = request.headers['role'];
    const method = request.method;
    const route = context.getClass().name + '-' + context.getHandler().name;

    const rolePermissions = {
      admin: [
        'GET-users-getUsers',
        'GET-users-getUserById',
        'POST-users-createuser',
        'DELETE-users-deleteuser',
        'PUT-users-updateUser',
      ],
      editor: [
        'GET-users-getUsers',
        'GET-users-getUserById',
        'POST-users-createuser',
        'PUT-users-updateUser',
      ],
      viewer: ['GET-users-getUsers', 'GET-users-getUserById'],
    };

    if (!role || !rolePermissions[role]?.includes(`${method}-${route}`)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
