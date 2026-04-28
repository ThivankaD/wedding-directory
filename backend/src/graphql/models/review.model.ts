import { Field, ObjectType } from '@nestjs/graphql';
import { OfferingModel } from './offering.model';
import { VisitorModel } from './visitor.model';

@ObjectType()
export class ReviewModel {
  @Field()
  id: string;

  @Field({ nullable: true })
  comment?: string;

  @Field()
  rating: string;

  @Field(() => [String], { nullable: true })
  image_urls?: string[];

  @Field(() => OfferingModel)
  offering: OfferingModel;

  @Field(() => OfferingModel, { nullable: true })
  mentionedOffering?: OfferingModel;
  
  @Field(() => VisitorModel)
  visitor: VisitorModel;

  @Field()
  createdAt: Date;

}