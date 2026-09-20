import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateServiceInput {

    @Field()
    vendor_id: string;

    @Field()
    name: string;

    @Field()
    category: string;
}
