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
    mentioned_service_id?: string;

    @Field()
    service_id: string;
    
    @Field()
    visitor_id: string;
}