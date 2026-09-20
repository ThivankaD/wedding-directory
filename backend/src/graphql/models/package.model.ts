import { ObjectType, Field } from '@nestjs/graphql';
import { ServiceModel } from './service.model';
import { PackageFeatureModel } from './package-feature.model';

@ObjectType()
export class PackageModel {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  pricing: number;

  @Field(() => [String])
  features: string[];

  @Field(() => [PackageFeatureModel], { nullable: true })
  packageFeatures?: PackageFeatureModel[];

  @Field(() => Boolean)
  visible: boolean;

  @Field(() => Boolean)
  requiresReservation: boolean;

  @Field(() => Boolean, { defaultValue: false })
  requiresApproval: boolean;

  @Field({ nullable: true })
  image?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
  


  @Field(() => ServiceModel, { nullable: true })
  service?: ServiceModel;

  @Field(() => [Date], { nullable: true })
  bookedDates?: Date[];
}