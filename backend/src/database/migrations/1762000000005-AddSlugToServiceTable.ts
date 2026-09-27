import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlugToServiceTable1762000000005 implements MigrationInterface {
  name = 'AddSlugToServiceTable1762000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Add slug column if it does not exist
    await queryRunner.query(`
      ALTER TABLE "service" 
      ADD COLUMN IF NOT EXISTS "slug" VARCHAR(200);
    `);

    // 2. Backfill existing records with clean URL slugs
    const services: Array<{ id: string; name: string; city: string | null }> = await queryRunner.query(`
      SELECT "id", "name", "city" 
      FROM "service" 
      WHERE "slug" IS NULL OR "slug" = '';
    `);

    const takenSlugs = new Set<string>();
    // Fetch any already existing non-null slugs
    const existingSlugs: Array<{ slug: string }> = await queryRunner.query(`
      SELECT "slug" FROM "service" WHERE "slug" IS NOT NULL AND "slug" != '';
    `);
    existingSlugs.forEach(r => takenSlugs.add(r.slug));

    for (const service of services) {
      const baseName = (service.name || 'service')
        .toLowerCase()
        .trim()
        .replace(/&/g, '-and-')
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-') || 'service';

      let candidate = baseName;
      let counter = 1;

      // If collision, try appending city
      if (takenSlugs.has(candidate) && service.city) {
        const citySlug = service.city
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-');
        candidate = `${baseName}-${citySlug}`;
      }

      // If still collision, append incremental number
      while (takenSlugs.has(candidate)) {
        counter++;
        candidate = `${baseName}-${counter}`;
      }

      takenSlugs.add(candidate);

      await queryRunner.query(
        `UPDATE "service" SET "slug" = $1 WHERE "id" = $2`,
        [candidate, service.id]
      );
    }

    // 3. Create unique index
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_service_slug" 
      ON "service" ("slug");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_service_slug";`);
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN IF EXISTS "slug";`);
  }
}
