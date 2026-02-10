import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TrackPackageViewInput {
  @Field({ nullable: true })
  visitorId?: string;

  @Field({ nullable: true })
  sessionId?: string;

  @Field({ nullable: true })
  ipAddress?: string;
}
