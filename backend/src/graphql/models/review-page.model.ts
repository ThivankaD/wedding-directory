import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ReviewModel } from './review.model';

@ObjectType()
export class ReviewPageModel {
  @Field(() => [ReviewModel])
  reviews: ReviewModel[];

  @Field(() => Float)
  averageRating: number;

  @Field(() => Int)
  totalReviews: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;
}
