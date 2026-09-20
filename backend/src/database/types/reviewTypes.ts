import { ServiceEntity } from "../entities/service.entity";
import { ReviewEntity } from "../entities/review.entity";
import { Repository } from "typeorm";
import { VisitorEntity } from "../entities/visitor.entity";

export type ReviewRepositoryType = Repository<ReviewEntity> & {
  createReview(
    createReviewInput: Partial<ReviewEntity>,
    service: ServiceEntity,
    visitor: VisitorEntity,
  ): Promise<ReviewEntity>;

  deleteReview(id: string): Promise<boolean>;

  findReviewById(id: string): Promise<ReviewEntity | null>;

  findReviewsByService(id: string): Promise<ReviewEntity[]>;

  findReviewsByServicePaginated(
    id: string,
    page: number,
    limit: number,
  ): Promise<[ReviewEntity[], number]>;

  getServiceReviewStats(id: string): Promise<{
    averageRating: number;
    totalReviews: number;
  }>;

  findAllReviews(): Promise<ReviewEntity[]>;
};
