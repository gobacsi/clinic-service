import { DynamicModule, Module } from '@nestjs/common';
import { HealthcheckController } from './controller';
import { HealthCheckService } from './service';

@Module({
  providers: [HealthCheckService],
})
export class HealthcheckModule {
  static register(): DynamicModule {
    return {
      module: HealthcheckModule,
      imports: [],
      controllers: [HealthcheckController],
      providers: [],
    };
  }
  // static registerConsumer(): DynamicModule {
  //   return {
  //     module: HealthcheckModule,
  //     imports: [],
  //     controllers: [HealthcheckConsumerController],
  //     providers: [],
  //   };
  // }
}
