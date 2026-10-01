import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlignServiceCategories1762000000008 implements MigrationInterface {
  name = 'AlignServiceCategories1762000000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Photographers' WHERE "category" = 'Photography';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Suits and Dresses' WHERE "category" = 'Bridal Wear';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Florists' WHERE "category" = 'Decor & Flowers';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Transportation' WHERE "category" = 'Wedding Cars';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Travel Agents' WHERE "category" = 'Wedding Planning';`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Photography' WHERE "category" = 'Photographers';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Bridal Wear' WHERE "category" = 'Suits and Dresses';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Decor & Flowers' WHERE "category" = 'Florists';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Wedding Cars' WHERE "category" = 'Transportation';`
    );
    await queryRunner.query(
      `UPDATE "service" SET "category" = 'Wedding Planning' WHERE "category" = 'Travel Agents';`
    );
  }
}
