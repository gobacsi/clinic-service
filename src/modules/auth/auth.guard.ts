import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import jwt from 'jsonwebtoken';
import { Logger } from '../common';
import { UnauthorizedException } from '../common/exceptions';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly keycloak: KeycloakService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const context = GqlExecutionContext.create(ctx);
    const req = context.getContext().req;
    const headerSplit = req.header('Authorization').split(' ', 2);
    if (headerSplit[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid Token');
    }
    const token = headerSplit[1];
    try {
      const claims = jwt.verify(token, await this.keycloak.getPublicKey());
      req.res.locals.token = token;
      req.res.locals.userId = claims.sub;
      req.res.locals.username = claims['preferred_username'];
      req.res.locals.phone = claims['phoneNumber'] || claims['preferred_username'];
      return true;
    } catch (error) {
      this.logger.warn(error, error.stack);
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
