import { Field, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class BaseModel {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  @Field()
  id?: number;

  @Column({
    name: 'is_deleted',
    type: 'boolean',
    default: false,
  })
  @Field()
  isDeleted?: boolean;

  @Column({
    name: 'created_by',
    type: 'varchar',
    length: 50,
    default: 'system',
  })
  createdBy?: string;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 50,
    default: 'system',
  })
  updatedBy?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  @Field()
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt?: Date;
}
