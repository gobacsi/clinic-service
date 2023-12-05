import { ObjectType } from '@nestjs/graphql';
import { Entity } from 'typeorm';
import { BaseModel } from '../common/abstracts/base.model';

@Entity({
  name: 'test',
})
@ObjectType()
export class ClinicModel extends BaseModel {}
