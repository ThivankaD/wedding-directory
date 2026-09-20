import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewEntity } from '../../database/entities/review.entity';
import { DataSource,Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRepository } from '../../database/repositories/review.repository';
import { ReviewRepositoryType } from '../../database/types/reviewTypes';
import { CreateReviewInput } from '../../graphql/inputs/createReview.input';
import { ServiceEntity } from '../../database/entities/service.entity';
import { VisitorEntity } from '../../database/entities/visitor.entity';
import { PaymentEntity } from '../../database/entities/payment.entity';

interface PaginatedReviewResult {
  reviews: ReviewEntity[];
  averageRating: number;
  totalReviews: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface ReviewEligibilityResult {
  canReview: boolean;
  reason: string;
  message: string;
  bookingDate?: Date;
}

@Injectable()
export class ReviewService {
  private reviewRepository: ReviewRepositoryType;
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {
    this.reviewRepository = ReviewRepository(this.dataSource);
  }

  async checkReviewEligibility(
    serviceId: string,
    visitorId?: string,
  ): Promise<ReviewEligibilityResult> {
    if (!visitorId) {
      return {
        canReview: false,
        reason: 'NOT_LOGGED_IN',
        message: 'Please log in as a couple to review this service.',
      };
    }

    const existingReview = await this.reviewRepository.findOne({
      where: {
        service: { id: serviceId },
        visitor: { id: visitorId },
      },
    });

    if (existingReview) {
      return {
        canReview: false,
        reason: 'ALREADY_REVIEWED',
        message: 'You have already reviewed this service. Thank you for your feedback!',
      };
    }

    const completedPayments = await this.paymentRepository.find({
      where: {
        status: 'completed',
        visitor: { id: visitorId },
        package: {
          service: { id: serviceId },
        },
      },
      relations: {
        package: {
          service: true,
        },
      },
    });

    if (!completedPayments || completedPayments.length === 0) {
      return {
        canReview: false,
        reason: 'NOT_BOOKED',
        message: 'Only couples who have booked a package for this service can leave a review.',
      };
    }

    const now = new Date();
    const hasPassedBookingDate = completedPayments.some((payment) => {
      if (payment.bookingDate) {
        return new Date(payment.bookingDate) <= now;
      }
      return payment.createdAt ? new Date(payment.createdAt) <= now : true;
    });

    if (!hasPassedBookingDate) {
      const upcomingBookings = completedPayments
        .filter((p) => p.bookingDate)
        .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());

      const nextBookingDate = upcomingBookings[0]?.bookingDate;

      return {
        canReview: false,
        reason: 'EVENT_PENDING',
        message: 'You can leave a review once your booked event date has passed.',
        bookingDate: nextBookingDate,
      };
    }

    return {
      canReview: true,
      reason: 'ELIGIBLE',
      message: 'You are eligible to review this service.',
    };
  }

  async createReview(
    createReviewInput: CreateReviewInput,
  ): Promise<ReviewEntity> {
    if (!Number.isInteger(createReviewInput.rating) || createReviewInput.rating < 1 || createReviewInput.rating > 5) {
      throw new BadRequestException('Rating must be an integer between 1 and 5');
    }

    if (createReviewInput.image_urls && createReviewInput.image_urls.length > 3) {
      throw new BadRequestException('You can upload a maximum of 3 review images');
    }

    const service = await this.serviceRepository.findOne({
      where: { id: createReviewInput.service_id },
    });

    const visitor = await this.visitorRepository.findOne({
      where: { id: createReviewInput.visitor_id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }
    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    // Check if visitor has already submitted a review for this service
    const existingReview = await this.reviewRepository.findOne({
      where: {
        service: { id: service.id },
        visitor: { id: visitor.id },
      },
    });
    if (existingReview) {
      throw new BadRequestException('You have already submitted a review for this service');
    }

    // Check if visitor has completed payment for this service
    const completedPayments = await this.paymentRepository.find({
      where: {
        status: 'completed',
        visitor: { id: visitor.id },
        package: {
          service: { id: service.id },
        },
      },
      relations: {
        package: {
          service: true,
        },
      },
    });

    if (!completedPayments || completedPayments.length === 0) {
      throw new BadRequestException('You must have booked and purchased a package for this service to leave a review');
    }

    // Check if the booked event date has passed
    const now = new Date();
    const hasPassedBookingDate = completedPayments.some((payment) => {
      if (payment.bookingDate) {
        return new Date(payment.bookingDate) <= now;
      }
      return payment.createdAt ? new Date(payment.createdAt) <= now : true;
    });

    if (!hasPassedBookingDate) {
      throw new BadRequestException('You can only leave a review after your booked event date has passed');
    }

    let mentionedService: ServiceEntity | undefined;
    if (createReviewInput.mentioned_service_id) {
      mentionedService = await this.serviceRepository.findOne({
        where: { id: createReviewInput.mentioned_service_id },
        relations: ['vendor'],
      });
    }

    const { mentioned_service_id, ...reviewPayload } = createReviewInput;

    return this.reviewRepository.createReview(
      {
        ...reviewPayload,
        mentionedService,
      },
      service,
      visitor,
    );
  }

  async deleteReview(id: string): Promise<boolean> {
    return this.reviewRepository.deleteReview(id);
  }

  async findReviewById(id: string): Promise<ReviewEntity> {
    return this.reviewRepository.findReviewById(id);
  }

  async findReviewsByService(serviceId: string): Promise<ReviewEntity[]> {
    return this.reviewRepository.findReviewsByService(serviceId);
  }

  async findReviewsByServicePaginated(
    serviceId: string,
    page: number,
    limit: number,
  ): Promise<PaginatedReviewResult> {
    const safePage = Math.max(1, page || 1);
    const safeLimit = Math.min(50, Math.max(1, limit || 5));

    const [reviews, totalReviews] = await this.reviewRepository.findReviewsByServicePaginated(
      serviceId,
      safePage,
      safeLimit,
    );

    const { averageRating } = await this.reviewRepository.getServiceReviewStats(serviceId);

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
