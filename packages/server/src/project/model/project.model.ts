import { Project } from '@prisma/client';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

/**
 * This is a model which adds the needed annotations to the Prisma Project
 * type for GraphQL. This is not what actually defines the database schema
 * but does need to be updated if the database schema changes.
 */
@ObjectType()
export class ProjectModel implements Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  logo: string | null;

  @Field(() => JSON)
  muiTheme: any;

  @Field()
  homePage: string;

  @Field()
  redirectUrl: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  deletedAt: Date | null;
}
