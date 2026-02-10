import { DataSource } from 'typeorm';
import { CreatePackageViewTable1707489026321 } from './migrations/1707489026321-CreatePackageViewTable';

async function runMigration() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'false' ? false : {
      rejectUnauthorized: false,
    },
    entities: ['src/database/entities/**/*.ts'],
    migrations: ['src/database/migrations/**/*.ts'],
  });

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
    
    const queryRunner = dataSource.createQueryRunner();
    const migration = new CreatePackageViewTable1707489026321();
    
    console.log('Running migration: CreatePackageViewTable1707489026321');
    await migration.up(queryRunner);
    console.log('Migration completed successfully!');
    
    await queryRunner.release();
    await dataSource.destroy();
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

runMigration();
