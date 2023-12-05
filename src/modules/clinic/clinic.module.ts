import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common';
import { ClinicLoader } from './clinic.dataloader';
import { ClinicModel } from './clinic.model';
import { ClinicRepository } from './clinic.repository';
import { ClinicResolver } from './clinic.resolver';
import { ClinicService } from './clinic.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClinicModel]), forwardRef(() => CommonModule)],
  providers: [ClinicLoader, ClinicService, ClinicResolver, ClinicRepository],
  exports: [TypeOrmModule, ClinicService, ClinicLoader],
})
export class ClinicModule {}
