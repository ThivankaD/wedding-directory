import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ReviewService } from "../../modules/review/review.service";
import { ReviewModel } from "../models/review.model";
import { ReviewEntity } from "../../database/entities/review.entity";
import { CreateReviewInput } from "../inputs/createReview.input";
import { ReviewPageModel } from "../models/review-page.model";
import { ReviewEligibilityModel } from "../models/review-eligibility.model";

@Resolver()
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => ReviewEligibilityModel)
  async checkReviewEligibility(
    @Args('offering_id') offeringId: string,
    @Args('visitor_id', { nullable: true }) visitorId?: string,
  ): Promise<ReviewEligibilityModel> {
    return this.reviewService.checkReviewEligibility(offeringId, visitorId);
  }

  @Mutation(() => ReviewModel)
  async createReview(
    @Args('input') input: CreateReviewInput,
  ): Promise<ReviewEntity> {
    return this.reviewService.createReview(input);
  }

  @Mutation(() => Boolean)
  async deleteReview(@Args('id') id: string): Promise<boolean> {
    return this.reviewService.deleteReview(id);
  }

  @Query(() => [ReviewModel])
  async findReviewsByOffering(
    @Args('offering_id') offeringId: string,
  ): Promise<ReviewEntity[]> {
    return this.reviewService.findReviewsByOffering(offeringId);
  }

  @Query(() => ReviewPageModel)
  async findReviewsByOfferingPaginated(
    @Args('offering_id') offeringId: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 5 }) limit: number,
  ): Promise<ReviewPageModel> {
    const result = await this.reviewService.findReviewsByOfferingPaginated(offeringId, page, limit);
    return {
      ...result,
      reviews: result.reviews as unknown as ReviewModel[],
    };
  }

  @Query(() => [ReviewModel])
  async findAllReviews(): Promise<ReviewEntity[]> {
    return this.reviewService.findAllReviews();
  }
}
