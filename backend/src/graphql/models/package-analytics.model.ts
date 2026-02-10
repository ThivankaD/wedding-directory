import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MonthlyViewModel } from "./monthly-view.model";

@ObjectType()
export class PackageAnalyticsModel {
  @Field(() => Int)
  totalUniqueViews: number;

  @Field(() => [MonthlyViewModel])
  monthlyViews: MonthlyViewModel[];
}
