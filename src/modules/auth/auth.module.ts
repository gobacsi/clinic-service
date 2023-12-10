import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { KeycloakService } from './keycloak.service';
import { UserResolver } from './user.resolver';

@Module({
  imports: [forwardRef(() => CommonModule)],
  providers: [KeycloakService, AuthResolver, AuthGuard, UserResolver],
  exports: [KeycloakService, AuthGuard],
})
export class AuthModule {}
