import { Global } from '@nestjs/common';
import * as dotenv from 'dotenv-safe';
import * as _ from 'lodash';
import { LOG_LEVEL_ENUM } from '../modules/common/common.constants';

@Global()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: process.env.ENV_PATH
        ? `${__dirname}/../../${process.env.ENV_PATH}`
        : `${__dirname}/../../.env`,
    });
  }

  get DATABASE_HOST(): string {
    return process.env.DB_HOST;
  }

  get DATABASE_PORT(): string {
    return process.env.DB_PORT;
  }

  get DATABASE_USERNAME(): string {
    return process.env.DB_USERNAME;
  }

  get DATABASE_PASSWORD(): string {
    return process.env.DB_PASSWORD;
  }

  get DATABASE_NAME(): string {
    return process.env.DB_DATABASE;
  }

  get DATABASE_SCHEMA(): string {
    return process.env.DB_SCHEMA || 'public';
  }

  get PORT(): number {
    return Number(process.env.PORT);
  }

  get NODE_ENV(): string {
    return process.env.NODE_ENV || 'production';
  }

  get BODY_SIZE_LIMIT(): string {
    return process.env.BODY_SIZE_LIMIT || '2mb';
  }

  get IS_DEVELOPMENT_MODE(): boolean {
    return _.toLower(process.env.IS_DEVELOPMENT_MODE) === 'true';
  }

  get LOG_LEVEL(): LOG_LEVEL_ENUM {
    return (process.env.LOG_LEVEL as LOG_LEVEL_ENUM) || LOG_LEVEL_ENUM.info;
  }

  get REDIS_URI(): string {
    return `redis://${process.env.REDIS_URI}`;
  }

  get REDIS_TTL(): number {
    return Number(process.env.REDIS_TTL);
  }

  get REDIS_DB(): number {
    return Number(process.env.REDIS_DB);
  }

  get POSTGRES_CONNECTION_TIMEOUT(): number {
    return Number(process.env.POSTGRES_CONNECTION_TIMEOUT);
  }

  get REDIS_CONNECTION_TIMEOUT(): number {
    return Number(process.env.REDIS_CONNECTION_TIMEOUT);
  }

  get DATALOADER_BATCH_SIZE(): number {
    return Number(process.env.DATALOADER_BATCH_SIZE);
  }

  get DATALOADER_TTL(): number {
    return Number(process.env.DATALOADER_TTL);
  }

  get KEYCLOAK_URL(): string {
    return process.env.KEYCLOAK_URL;
  }

  get KEYCLOAK_REALM(): string {
    return process.env.KEYCLOAK_REALM;
  }

  get KEYCLOAK_CLIENT_ID(): string {
    return process.env.KEYCLOAK_CLIENT_ID;
  }

  get KEYCLOAK_CLIENT_SECRET(): string {
    return process.env.KEYCLOAK_CLIENT_SECRET;
  }
}

export const configService = new ConfigService();
