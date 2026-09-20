import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class ServiceMediaModel {
  @Field(() => ID)
  id: string;

  @Field()
  mediaType: string;

  @Field()
  url: string;

  @Field(() => Int)
  slotIndex: number;

  @Field()
  createdAt: Date;
}
