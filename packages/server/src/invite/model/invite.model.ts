import { Field, ID, Int, ObjectType, Directive } from '@nestjs/graphql';

/**
 * This is a model which adds the needed annotations to the Prisma Project
 * type for GraphQL. This is not what actually defines the database schema
 * but does need to be updated if the database schema changes.
 */
@ObjectType()
@Directive('@key(fields: "id")')
export class InviteModel {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => Int)
  role: number;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt: Date;
}
