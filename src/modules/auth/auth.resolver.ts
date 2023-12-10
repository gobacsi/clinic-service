import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '../common';
import { AuthToken } from './entities/auth-token.entity';
import { Otp } from './entities/otp.entity';
import { KeycloakService } from './keycloak.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly keycloak: KeycloakService,
    private readonly logger: Logger,
  ) {}

  @Query(() => Otp)
  async sendLoginOtp(@Args('phoneNumber') phoneNumber: string): Promise<Otp> {
    return this.keycloak.sendLoginOtp(phoneNumber);
  }

  @Mutation(() => AuthToken)
  async login(
    @Args('phoneNumber') phoneNumber: string,
    @Args('otp') otp: string,
  ): Promise<AuthToken> {
    return this.keycloak.loginEverybody(phoneNumber, otp);
  }
}
