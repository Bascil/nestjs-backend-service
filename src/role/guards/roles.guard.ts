import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../role.decorator';
import { Role } from '../enums/role.enum';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false; // No user in request, deny access
    }

    const userRole = await this.userService.getUserById(user.sub);

    // Convert the user role to the corresponding enum value
    const userRoleEnum = Role[userRole.roleName as keyof typeof Role];

    // Check if the user's role is included in the required roles
    return requiredRoles.includes(userRoleEnum);
  }
}
