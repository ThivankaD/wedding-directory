import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReviewEligibilityModel {
  @Field(() => Boolean)
  canReview: boolean;

  @Field(() => String)
  reason: string;

  @Field(() => String)
  message: string;

  @Field(() => Date, { nullable: true })
  bookingDate?: Date;
}
