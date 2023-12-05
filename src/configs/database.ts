import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configService } from './config.service';

const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.DATABASE_HOST,
  port: Number(configService.DATABASE_PORT),
  username: configService.DATABASE_USERNAME,
  password: configService.DATABASE_PASSWORD,
  database: configService.DATABASE_NAME,
  schema: configService.DATABASE_SCHEMA,
  entities: [__dirname + '/../**/*model{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: configService.IS_DEVELOPMENT_MODE,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  keepConnectionAlive: true,
  connectTimeoutMS: configService.POSTGRES_CONNECTION_TIMEOUT,
};

export = databaseConfig;
