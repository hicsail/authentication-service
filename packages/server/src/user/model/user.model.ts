import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

/**
 * This is a model which adds the needed annotations to the Prisma Project
 * type for GraphQL. This is not what actually defines the database schema
 * but does need to be updated if the database schema changes.
 */
@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  password: string;

  @Field()
  role: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;

  @Field({ nullable: true })
  resetCode: string;

  @Field({ nullable: true })
  resetCodeExpiresAt: Date;
}
