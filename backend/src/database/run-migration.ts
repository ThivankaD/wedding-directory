import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { CreatePackageViewTable1707489026321 } from './migrations/1707489026321-CreatePackageViewTable';
import { AddReviewImagesAndMentions1762000000000 } from './migrations/1762000000000-AddReviewImagesAndMentions';

dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const normalizeDatabaseUrl = (value?: string): string | undefined => {
  if (!value) return undefined;
  return value.trim().replace(/^['"]|['"]$/g, '');
};

const parseDbSsl = (): boolean => {
  const raw = process.env.DB_SSL?.trim().toLowerCase();
  if (raw === 'true') return true;
  if (raw === 'false') return false;

  const dbUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
  if (dbUrl?.includes('sslmode=require')) return true;

  return false;
};

async function runMigration() {
  const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing. Set it in backend/.env');
  }

  const useSsl = parseDbSsl();

  const dataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    ssl: useSsl ? {
      rejectUnauthorized: false,
    } : false,
    entities: ['src/database/entities/**/*.ts'],
    migrations: ['src/database/migrations/**/*.ts'],
  });

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
    
    const queryRunner = dataSource.createQueryRunner();
    const packageViewExists = await queryRunner.hasTable('package_view');
    if (!packageViewExists) {
      const migration = new CreatePackageViewTable1707489026321();
      console.log(`Running migration: ${migration.name}`);
      await migration.up(queryRunner);
    } else {
      console.log('Skipping CreatePackageViewTable1707489026321 (already applied).');
    }

    const hasImageUrls = await queryRunner.hasColumn('review', 'image_urls');
    const hasMentionedOffering = await queryRunner.hasColumn('review', 'mentioned_offering_id');

    if (!hasImageUrls || !hasMentionedOffering) {
      const migration = new AddReviewImagesAndMentions1762000000000();
      console.log(`Running migration: ${migration.name}`);
      await migration.up(queryRunner);
    } else {
      console.log('Skipping AddReviewImagesAndMentions1762000000000 (already applied).');
    }

    console.log('Migration completed successfully!');
    
    await queryRunner.release();
    await dataSource.destroy();
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigration();
