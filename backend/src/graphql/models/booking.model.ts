import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
class ServiceProviderModel {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;
}

@ObjectType()
export class BookingModel {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  date: string;

  @Field()
  time: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  location: string;

  @Field(() => ServiceProviderModel, { nullable: true })
  serviceProvider: ServiceProviderModel;

  @Field({ nullable: true })
  packageName: string;

  @Field({ nullable: true })
  offeringName: string;

  @Field(() => Float)
  amount: number;

  @Field()
  createdAt: Date;
}
