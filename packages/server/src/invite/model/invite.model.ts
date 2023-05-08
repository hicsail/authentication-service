import { Field, ID, Int, ObjectType, Directive } from '@nestjs/graphql';
import { InviteStatus } from './invite.status';

/**
 * Represents an invitation to join a project.
 */
@ObjectType()
@Directive('@key(fields: "id")')
export class InviteModel {
  /**
   * The ID of the invitation.
   */
  @Field(() => ID, { description: 'The ID of the invitation.' })
  id: string;

  /**
   * The ID of the project to which the invitation belongs.
   */
  @Field({ description: 'The ID of the project to which the invitation belongs.' })
  projectId: string;

  /**
   * The email address of the user being invited.
   */
  @Field({ description: 'The email address of the user being invited.' })
  email: string;

  /**
   * The role that the user being invited will have.
   */
  @Field(() => Int, { description: 'The role that the user being invited will have.' })
  role: number;

  /**
   * The date and time at which the invitation expires.
   */
  @Field({ description: 'The date and time at which the invitation expires.' })
  expiresAt: Date;

  /**
   * The date and time at which the invitation was created.
   */
  @Field({ description: 'The date and time at which the invitation was created.' })
  createdAt: Date;

  /**
   * The date and time at which the invitation was last updated.
   */
  @Field({ description: 'The date and time at which the invitation was last updated.' })
  updatedAt: Date;

  /**
   * The date and time at which the invitation was deleted, if applicable.
   */
  @Field({ nullable: true, description: 'The date and time at which the invitation was deleted, if applicable.' })
  deletedAt: Date;

  /**
   * The status of the invitation, based on whether it has been accepted,
   * cancelled, expired, or is still pending.
   */
  @Field(() => InviteStatus, { description: 'The status of the invitation.' })
  status?: InviteStatus;
}
