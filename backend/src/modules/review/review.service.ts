import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewEntity } from '../../database/entities/review.entity';
import { DataSource,Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRepository } from '../../database/repositories/review.repository';
import { ReviewRepositoryType } from '../../database/types/reviewTypes';
import { CreateReviewInput } from '../../graphql/inputs/createReview.input';
import { OfferingEntity } from '../../database/entities/offering.entity';
import { VisitorEntity } from '../../database/entities/visitor.entity';

interface PaginatedReviewResult {
  reviews: ReviewEntity[];
  averageRating: number;
  totalReviews: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}


@Injectable()
export class ReviewService {
  private reviewRepository: ReviewRepositoryType;
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(OfferingEntity)
    private readonly offeringRepository: Repository<OfferingEntity>,
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
  ) {
    this.reviewRepository = ReviewRepository(this.dataSource);
  }

  async createReview(
    createReviewInput: CreateReviewInput,
  ): Promise<ReviewEntity> {
    if (!Number.isInteger(createReviewInput.rating) || createReviewInput.rating < 1 || createReviewInput.rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }

    const offering = await this.offeringRepository.findOne({
      where: { id: createReviewInput.offering_id },
    });

    const visitor = await this.visitorRepository.findOne({
      where: { id: createReviewInput.visitor_id },
    });

    if (!offering) {
      throw new NotFoundException('Offering not found');
    }
    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    let mentionedOffering: OfferingEntity | undefined;
    if (createReviewInput.mentioned_offering_id) {
      mentionedOffering = await this.offeringRepository.findOne({
        where: { id: createReviewInput.mentioned_offering_id },
        relations: ['vendor'],
      });
    }

    const { mentioned_offering_id, ...reviewPayload } = createReviewInput;

    return this.reviewRepository.createReview(
      {
        ...reviewPayload,
        mentionedOffering,
      },
      offering,
      visitor,
    );
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.reviewRepository.deleteReview(id);
  }

  async findReviewById(id: string): Promise<ReviewEntity> {
    return this.reviewRepository.findReviewById(id);
  }

  async findReviewsByOffering(offeringId: string): Promise<ReviewEntity[]> {
    return this.reviewRepository.findReviewsByOffering(offeringId);
  }

  async findReviewsByOfferingPaginated(
    offeringId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewResult> {
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.min(50, Math.max(1, limit || 5));

    const [reviews, totalReviews] = await this.reviewRepository.findReviewsByOfferingPaginated(
      offeringId,
      safePage,
      safeLimit,
    );

    const { averageRating } = await this.reviewRepository.getOfferingReviewStats(offeringId);

    return {
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
      currentPage: safePage,
      pageSize: safeLimit,
      totalPages: Math.max(1, Math.ceil(totalReviews / safeLimit)),
    };
  }

  async findAllReviews(): Promise<ReviewEntity[]> {
    return this.reviewRepository.findAllReviews();
  }
}
