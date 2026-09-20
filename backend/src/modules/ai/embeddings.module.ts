import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from '../../database/entities/vendor.entity';
import { ServiceEntity } from '../../database/entities/service.entity';
import { PackageEntity } from '../../database/entities/package.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([VendorEntity, ServiceEntity, PackageEntity])],
  providers: [EmbeddingsService],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}