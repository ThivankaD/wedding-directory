import { DataSource } from 'typeorm';
import { ReviewEntity } from '../entities/review.entity';
import { ReviewRepositoryType } from '../types/reviewTypes';
import { OfferingEntity } from '../entities/offering.entity';
import { VisitorEntity } from '../entities/visitor.entity';

// Use the DataSource to get the base repository and extend it
export const ReviewRepository = (
  dataSource: DataSource,
): ReviewRepositoryType =>
  dataSource.getRepository(ReviewEntity).extend({
    async createReview(
      createReviewInput: Partial<ReviewEntity>,
      offering: OfferingEntity,
      visitor: VisitorEntity,
    ): Promise<ReviewEntity> {
      const review = this.create({
        ...createReviewInput,
        offering,
        visitor,
      });
      return this.save(review);
    },

    async updateReview(
      id: string,
      updateReviewInput: Partial<ReviewEntity>,
    ): Promise<ReviewEntity> {
      const review = await this.findOne({ where: { id } });
      if (!review) {
        throw new Error('Service not found');
      }
      return this.save({
        ...review,
        ...updateReviewInput,
      });
    },

    async deleteReview(id: string): Promise<boolean> {
      const result = await this.delete({ id });
      return result.affected > 0;
    },

    async findReviewById(id: string): Promise<ReviewEntity> {
      return this.findOne({
        relations: ['offering', 'visitor', 'mentionedOffering'],
        where: { id },
      });
    },

    async findReviewsByOffering(offeringId: string): Promise<ReviewEntity[]> {
      return await this.find({
        where: { offering: { id: offeringId } },
        relations: ['visitor', 'offering', 'mentionedOffering', 'mentionedOffering.vendor'],
        order: { createdAt: 'DESC' },
      });
    },

    async findReviewsByOfferingPaginated(
      offeringId: string,
      page: number,
      limit: number,
    ): Promise<[ReviewEntity[], number]> {
      return this.findAndCount({
        where: { offering: { id: offeringId } },
        relations: ['visitor', 'offering', 'mentionedOffering', 'mentionedOffering.vendor'],
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
    },

    async getOfferingReviewStats(
      offeringId: string,
    ): Promise<{ averageRating: number; totalReviews: number }> {
      const result = await this.createQueryBuilder('review')
        .select('COUNT(review.id)', 'totalReviews')
        .addSelect('COALESCE(AVG(review.rating), 0)', 'averageRating')
        .where('review.offering_id = :offeringId', { offeringId })
        .getRawOne();

      const typedResult = result as { totalReviews?: string; averageRating?: string } | null;

      return {
        totalReviews: Number(typedResult?.totalReviews ?? 0),
        averageRating: Number(typedResult?.averageRating ?? 0),
      };
    },

    async findAllReviews(): Promise<ReviewEntity[]> {
      return await this.find({
        relations: [
          'visitor',
          'offering',
          'offering.vendor',
          'mentionedOffering',
          'mentionedOffering.vendor',
        ],
        order: { createdAt: 'DESC' },
      });
    },

  });
