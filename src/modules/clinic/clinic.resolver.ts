import { Args, Query, Resolver } from '@nestjs/graphql';
import { Logger } from '../common';
import { ClinicModel } from './clinic.model';
import { ClinicService } from './clinic.service';

@Resolver(ClinicModel)
export class ClinicResolver {
  constructor(
    private readonly service: ClinicService,
    private readonly logger: Logger,
  ) {}

  @Query(() => [ClinicModel])
  async clinicById(@Args('id') id: number): Promise<ClinicModel[]> {
    return this.service.getByIds([id]);
  }
}
