import { Module } from '@nestjs/common';
import { VectorSearchService } from './vector-search.service';
import { EmbeddingsModule } from './embeddings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from '../../database/entities/vendor.entity';
import { ServiceEntity } from '../../database/entities/service.entity';
import { PackageEntity } from '../../database/entities/package.entity';

@Module({
  imports: [
    EmbeddingsModule,
    TypeOrmModule.forFeature([
        VendorEntity,
        ServiceEntity,
        PackageEntity
    ])
  ],
  providers: [VectorSearchService],
  exports: [VectorSearchService],
})
export class VectorSearchModule {}