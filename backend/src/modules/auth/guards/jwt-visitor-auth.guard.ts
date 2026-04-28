import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtVisitorAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = { userType?: string }>(
    err: unknown,
    user: { userType?: string },
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Visitor authentication required');
    }

    if (user.userType !== 'visitor') {
      throw new ForbiddenException('Only registered visitors can access this resource');
    }

    return user as TUser;
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
