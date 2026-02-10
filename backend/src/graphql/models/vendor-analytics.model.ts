import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MonthlyViewModel } from "./monthly-view.model";
import { PackageAnalyticsItemModel } from "./package-analytics-item.model";

@ObjectType()
export class VendorAnalyticsModel {
  @Field(() => Int)
  totalUniqueViews: number;

  @Field(() => [PackageAnalyticsItemModel])
  packagesAnalytics: PackageAnalyticsItemModel[];

  @Field(() => [MonthlyViewModel])
  monthlyViews: MonthlyViewModel[];
}
