import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AcceptInviteModel {
  @Field()
  inviteCode: string;

  @Field()
  projectId: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  fullname: string;
}
