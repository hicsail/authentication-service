import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: 'Input type for accepting an invite' })
export class AcceptInviteModel {
  /**
   * The invite code that was included in the invite email
   */
  @Field({ description: 'The invite code that was included in the invite email' })
  inviteCode: string;

  /**
   * The ID of the project the invite is associated with
   */
  @Field({ description: 'The ID of the project the invite is associated with' })
  projectId: string;

  /**
   * The email address of the user accepting the invite
   */
  @Field({ description: 'The email address of the user accepting the invite' })
  email: string;

  /**
   * The password for the new user account
   */
  @Field({ description: 'The password for the new user account' })
  password: string;

  /**
   * The full name of the user accepting the invite
   */
  @Field({ description: 'The full name of the user accepting the invite' })
  fullname: string;
}
