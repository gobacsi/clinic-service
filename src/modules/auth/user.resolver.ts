import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../decorators/user.decorator';
import { Logger } from '../common';
import { AuthGuard } from './auth.guard';
import { User } from './entities/user.entity';
import { KeycloakService } from './keycloak.service';

@Resolver(User)
@UseGuards(AuthGuard)
export class UserResolver {
  constructor(
    private readonly keycloak: KeycloakService,
    private readonly logger: Logger,
  ) {}

  @Query(() => User)
  async myProfile(@CurrentUser() me: User): Promise<User> {
    return me;
  }
}
