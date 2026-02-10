import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MonthlyViewModel {
  @Field()
  month: string;

  @Field(() => Int)
  views: number;
}
