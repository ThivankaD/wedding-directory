import { Module } from '@nestjs/common';
import { ServiceResolver } from '../../graphql/resolvers/service.resolver';
import { ServiceService } from './service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from '../../database/entities/vendor.entity';
import { ServiceEntity } from '../../database/entities/service.entity';
import { ServiceMediaEntity } from '../../database/entities/service-media.entity';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceEntity, 
      VendorEntity,
      ServiceMediaEntity,
    ]),
    ReviewModule,
  ],
  providers: [ServiceResolver, ServiceService],
  exports: [ServiceService]
})
export class ServiceModule {}