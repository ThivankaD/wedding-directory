import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropVendorLocationColumn1762000000006 implements MigrationInterface {
  name = 'DropVendorLocationColumn1762000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the location column from the vendor table — city is sufficient.
    await queryRunner.query(`
      ALTER TABLE "vendor" DROP COLUMN IF EXISTS "location";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add location column if rolling back
    await queryRunner.query(`
      ALTER TABLE "vendor" ADD COLUMN IF NOT EXISTS "location" VARCHAR(500) NOT NULL DEFAULT '';
    `);
  }
}
