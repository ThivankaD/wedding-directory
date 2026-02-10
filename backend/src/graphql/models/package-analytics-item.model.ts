import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PackageAnalyticsItemModel {
  @Field()
  packageId: string;

  @Field()
  packageName: string;

  @Field(() => Int)
  uniqueViews: number;
}
