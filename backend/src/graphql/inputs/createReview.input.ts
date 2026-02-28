import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {

    @Field({ nullable: true })
    comment?: string;

    @Field()
    rating: number;

    @Field(() => [String], { nullable: true })
    image_urls?: string[];

    @Field({ nullable: true })
    mentioned_offering_id?: string;

    @Field()
    offering_id: string;
    
    @Field()
    visitor_id: string;
}