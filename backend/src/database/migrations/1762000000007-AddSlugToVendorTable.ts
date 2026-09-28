import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlugToVendorTable1762000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor" ADD COLUMN IF NOT EXISTS "slug" varchar(200) UNIQUE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor" DROP COLUMN IF EXISTS "slug"`
    );
  }
}
