import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropRedundantColumns1762000000003 implements MigrationInterface {
  name = 'DropRedundantColumns1762000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop photo_showcase and video_showcase from the service table.
    // These were array columns that duplicated data already stored in service_media.
    // service_media is now the single source of truth for all media.
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN IF EXISTS "photo_showcase"`);
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN IF EXISTS "video_showcase"`);

    // Drop the features array column from the package table.
    // Features are stored normalised in the package_feature table.
    // The column was redundant; package_feature is the single source of truth.
    await queryRunner.query(`ALTER TABLE "package" DROP COLUMN IF EXISTS "features"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore columns (data cannot be recovered from this migration alone)
    await queryRunner.query(`ALTER TABLE "service" ADD COLUMN "photo_showcase" text[]`);
    await queryRunner.query(`ALTER TABLE "service" ADD COLUMN "video_showcase" text[]`);
    await queryRunner.query(`ALTER TABLE "package" ADD COLUMN "features" varchar[]`);
  }
}
