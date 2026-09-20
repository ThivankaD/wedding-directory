import { Module } from '@nestjs/common';
import { ReviewResolver } from '../../graphql/resolvers/review.resolver';
import { ReviewService } from './review.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '../../database/entities/review.entity';
import { VisitorEntity } from '../../database/entities/visitor.entity';
import { ServiceEntity } from '../../database/entities/service.entity';
import { PaymentEntity } from '../../database/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, VisitorEntity, ServiceEntity, PaymentEntity])
  ],
  providers: [ReviewResolver, ReviewService],
  exports: [ReviewService]
})

export class ReviewModule {}