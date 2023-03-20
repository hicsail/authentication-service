import { Field, ID, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { ProjectAuthMethodsModel } from './project-auth-methods.model';
import { ProjectSettingsModel } from './project-settings.model';

/**
 * This is a model which adds the needed annotations to the Prisma Project
 * type for GraphQL. This is not what actually defines the database schema
 * but does need to be updated if the database schema changes.
 */
@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field(() => JSON)
  muiTheme: any;

  @Field({ nullable: true })
  homePage?: string;

  @Field({ nullable: true })
  redirectUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  deletedAt?: Date;
}
