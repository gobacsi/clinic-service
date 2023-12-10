import { configService } from './config.service';

interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
  clientSecret: string;
}

const keycloakConfig: KeycloakConfig = {
  url: configService.KEYCLOAK_URL,
  realm: configService.KEYCLOAK_REALM,
  clientId: configService.KEYCLOAK_CLIENT_ID,
  clientSecret: configService.KEYCLOAK_CLIENT_SECRET,
};

export = keycloakConfig;
