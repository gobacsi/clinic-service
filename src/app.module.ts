import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Logger } from 'winston';
import { ConfigService, configService } from './configs/config.service';
import databaseConfig from './configs/database';
import redisConfig from './configs/redis';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { ClinicLoader } from './modules/clinic/clinic.dataloader';
import { ClinicModule } from './modules/clinic/clinic.module';
import { CommonModule } from './modules/common';
import { HealthcheckModule } from './modules/healthcheck/module';
import { RedisModule } from './modules/redis';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [ClinicModule],
      useFactory: (clinicLoader: ClinicLoader) => ({
        autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
        path: '/clinic/graphql',
        sortSchema: true,
        debug: configService.IS_DEVELOPMENT_MODE,
        playground: configService.IS_DEVELOPMENT_MODE,
        cache: 'bounded',
        buildSchemaOptions: {
          numberScalarMode: 'integer',
          orphanedTypes: [],
        },
        context: () => {
          return {
            clinicLoaderById: clinicLoader.initLoaderById(),
          };
        },
      }),
      inject: [ClinicLoader],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => databaseConfig,
    }),
    RedisModule.register(redisConfig),
    HealthcheckModule.register(),
    CommonModule,
    ClinicModule,
  ],
  controllers: [],
  providers: [ConfigService, Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude({ path: '/clinic/health', method: RequestMethod.ALL })
      .forRoutes({ path: '/clinic/*', method: RequestMethod.ALL });
  }
}
