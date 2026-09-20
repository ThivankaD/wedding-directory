import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class PackageFeatureModel {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field(() => Int)
  sortOrder: number;

  @Field()
  createdAt: Date;
}
