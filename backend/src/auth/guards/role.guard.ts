import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../custom-decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as {
      sub: string;
      email: string;
      role: string;
    };
    return this.matchRole(user.role, roles);
  }

  private matchRole(userRole: string, authRoles: string[]) {
    return authRoles.includes(userRole);
  }
}
