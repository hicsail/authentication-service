import { Project } from '@prisma/client';
import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import JSON from 'graphql-type-json';
import { ProjectSettingsModel } from '../model/project-settings.model';
import { ProjectAuthMethodsModel } from '../model/project-auth-methods.model';

/**
 * Input type for making a new project
 */
@InputType()
export class ProjectCreateInput implements Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @Field()
  description: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  logo: string | null;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  muiTheme: any;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  homePage: string | null;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  redirectUrl: string | null;

  @IsNotEmpty()
  @IsDefined()
  @Field()
  displayProjectName: boolean;

  @IsNotEmpty()
  @IsDefined()
  @Field()
  allowSignup: boolean;

  @IsNotEmpty()
  @IsDefined()
  @Field()
  googleAuth: boolean;
}

export class ProjectIdentifier {
  id: string;
  name: string;
}

/**
 * Represents the settings which can be changed. This is a subset of the
 * Project type and is partial to allow changing only some of the settings
 * at a time.
 */
@InputType()
export class ConfigurableProjectSettings implements Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>> {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: true })
  description: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  logo: string | null;

  @IsOptional()
  @Field(() => JSON, { nullable: true })
  muiTheme: any;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  homePage: string | null;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  redirectUrl: string | null;
}

/**
 * Input type for updating a project's settings
 */
@InputType()
export class ProjectSettingsInput implements Partial<ProjectSettingsModel> {
  @IsOptional()
  @IsNotEmpty()
  @Field()
  displayProjectName: boolean;

  @IsOptional()
  @IsNotEmpty()
  @Field()
  allowSignup: boolean;
}

@InputType()
export class ProjectAuthMethodsInput implements Partial<ProjectAuthMethodsModel> {
  @IsOptional()
  @IsNotEmpty()
  @Field()
  googleAuth: boolean;
}
