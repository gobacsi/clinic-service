import { MigrationInterface, QueryRunner } from 'typeorm';
import { configService } from '../configs/config.service';

export class Init1701232566911 implements MigrationInterface {
  name = 'Init1701232566911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${configService.DATABASE_SCHEMA}"."test" (
                "id" BIGSERIAL NOT NULL,
                "is_deleted" boolean NOT NULL DEFAULT false,
                "created_by" character varying(50) NOT NULL DEFAULT 'system',
                "updated_by" character varying(50) NOT NULL DEFAULT 'system',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "clinic"."test"
        `);
  }
}
