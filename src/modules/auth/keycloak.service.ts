import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { configService } from '../../configs/config.service';
import { Logger } from '../common';
import { HttpClient } from '../common/http-client';
import { AuthToken } from './entities/auth-token.entity';
import { Otp } from './entities/otp.entity';

@Injectable()
export class KeycloakService {
  private readonly url: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly clientToken: string;
  private publicKey: string;
  constructor(
    private readonly logger: Logger,
    private readonly httpClient: HttpClient,
  ) {
    this.url = configService.KEYCLOAK_URL;
    this.realm = configService.KEYCLOAK_REALM;
    this.clientId = configService.KEYCLOAK_CLIENT_ID;
    this.clientSecret = configService.KEYCLOAK_CLIENT_SECRET;
  }

  async getPublicKey(): Promise<string> {
    if (!this.publicKey) {
      const cert = await this.httpClient.get<{ public_key: string }>({
        url: `${this.url}/realms/${this.realm}`,
      });
      this.publicKey = `-----BEGIN PUBLIC KEY-----\n${cert.public_key}\n-----END PUBLIC KEY-----`;
    }
    return this.publicKey;
  }

  async getClientToken(): Promise<string> {
    if (this.clientToken) {
      try {
        jwt.verify(this.clientToken, await this.getPublicKey());
        return this.clientToken;
      } catch (e) {
        this.logger.warn(`client token not verified`, e.stack);
      }
    }
    const clientCredential = await this.httpClient.post<{ access_token: string }>(
      {
        url: `${this.url}/realms/${this.realm}/protocol/openid-connect/token`,
        axiosConfig: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
      {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      },
    );
    return clientCredential.access_token;
  }

  async sendLoginOtp(phoneNumber: string): Promise<Otp> {
    return this.httpClient.get<Otp>({
      url: `${this.url}/realms/${this.realm}/sms/authentication-code`,
      axiosConfig: {
        params: {
          phoneNumber,
        },
      },
    });
  }

  async loginEverybody(phoneNumber: string, otp: string): Promise<AuthToken> {
    return this.httpClient.post<AuthToken>(
      {
        url: `${this.url}/realms/${this.realm}/protocol/openid-connect/token`,
        axiosConfig: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
      {
        grant_type: 'password',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        phoneNumber,
        code: otp,
      },
    );
  }
}
