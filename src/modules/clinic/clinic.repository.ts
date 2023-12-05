import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ClinicModel } from './clinic.model';

@Injectable()
export class ClinicRepository extends Repository<ClinicModel> {
  constructor(private dataSource: DataSource) {
    super(ClinicModel, dataSource.createEntityManager());
  }
  getById(id: number): Promise<ClinicModel> {
    return this.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }
}
