import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { Logger } from '../common';
import { ClinicModel } from './clinic.model';
import { ClinicRepository } from './clinic.repository';

@Injectable()
export class ClinicService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: ClinicRepository,
  ) {}

  async getByIds(ids: number[], entityManager?: EntityManager): Promise<ClinicModel[]> {
    const repo = entityManager ? entityManager.getRepository(ClinicModel) : this.repository;
    return repo.find({
      where: {
        id: In(ids),
        isDeleted: false,
      },
    });
  }
}
