import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ServiceModel } from './service.model';
import { VisitorModel } from './visitor.model';

@ObjectType()
export class ReviewModel {
  @Field()
  id: string;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => Int)
  rating: number;

  @Field(() => [String], { nullable: true })
  image_urls?: string[];

  @Field(() => ServiceModel)
  service: ServiceModel;

  @Field(() => ServiceModel, { nullable: true })
  mentionedService?: ServiceModel;
  
  @Field(() => VisitorModel, { nullable: true })
  visitor?: VisitorModel;

  @Field()
  createdAt: Date;

}