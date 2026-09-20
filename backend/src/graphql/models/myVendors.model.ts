import { ObjectType, Field } from '@nestjs/graphql';
import { ServiceModel } from './service.model';
import { VisitorModel } from './visitor.model';

@ObjectType()
export class MyVendorsModel {
  @Field()
  id: string;

  @Field(() => VisitorModel)
  visitor: VisitorModel;

  @Field(() => ServiceModel)
  service: ServiceModel;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}