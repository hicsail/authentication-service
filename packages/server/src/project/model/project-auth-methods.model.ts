import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * This is a model which adds the needed annotations to the Prisma Project Auth Methods
 * type for GraphQL. This is not what actually defines the database schema
 * but does need to be updated if the database schema changes.
 */
@ObjectType()
export class ProjectAuthMethodsModel {
  @Field()
  googleAuth: boolean;
  
  @Field()
  emailAuth: boolean;
}
