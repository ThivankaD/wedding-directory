import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/database/entities/service.entity';
import { ReviewEntity } from 'src/database/entities/review.entity';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, ReviewEntity]), HttpModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
