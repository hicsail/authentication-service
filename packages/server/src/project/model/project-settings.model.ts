import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * This is a model which adds the needed annotations to the Prisma Project Settings
 * type for GraphQL. This is not what actually defines the database schema
 * but does need to be updated if the database schema changes.
 */
@ObjectType()
export class ProjectSettingsModel {
  @Field()
  displayProjectName: boolean;

  @Field()
  allowSignup: boolean;

  @Field({ nullable: true })
  verifyEmail?: boolean;
}
