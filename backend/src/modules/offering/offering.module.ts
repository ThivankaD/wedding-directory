import { Module } from '@nestjs/common';
import { OfferingResolver } from '../../graphql/resolvers/offering.resolver';
import { OfferingService } from './offering.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from '../../database/entities/vendor.entity';
import { OfferingEntity } from '../../database/entities/offering.entity';
import { OfferingMediaEntity } from '../../database/entities/offering-media.entity';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OfferingEntity, 
      VendorEntity,
      OfferingMediaEntity,
    ]),
    ReviewModule,
  ],
  providers: [OfferingResolver, OfferingService],
  exports: [OfferingService]
})
export class OfferingModule {}