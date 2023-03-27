/* Generated File DO NOT EDIT. */
/* tslint:disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
};

export type AccessToken = {
  __typename?: 'AccessToken';
  accessToken: Scalars['String'];
};

export type ConfigurableProjectSettings = {
  description?: InputMaybe<Scalars['String']>;
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name?: InputMaybe<Scalars['String']>;
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type EmailLoginDto = {
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type ForgotDto = {
  email: Scalars['String'];
  projectId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: ProjectModel;
  forgotPassword: Scalars['Boolean'];
  loginEmail: AccessToken;
  loginUsername: AccessToken;
  resetPassword: Scalars['Boolean'];
  signup: AccessToken;
  updateProject: ProjectModel;
  updateProjectAuthMethods: ProjectModel;
  updateProjectSettings: ProjectModel;
};

export type MutationCreateProjectArgs = {
  project: ProjectCreateInput;
};

export type MutationForgotPasswordArgs = {
  user: ForgotDto;
};

export type MutationLoginEmailArgs = {
  user: EmailLoginDto;
};

export type MutationLoginUsernameArgs = {
  user: UsernameLoginDto;
};

export type MutationResetPasswordArgs = {
  user: ResetDto;
};

export type MutationSignupArgs = {
  user: UserSignupDto;
};

export type MutationUpdateProjectArgs = {
  id: Scalars['String'];
  settings: ConfigurableProjectSettings;
};

export type MutationUpdateProjectAuthMethodsArgs = {
  id: Scalars['String'];
  projectAuthMethods: ProjectAuthMethodsInput;
};

export type MutationUpdateProjectSettingsArgs = {
  id: Scalars['String'];
  projectSettings: ProjectSettingsInput;
};

export type ProjectAuthMethodsInput = {
  googleAuth?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectAuthMethodsModel = {
  __typename?: 'ProjectAuthMethodsModel';
  googleAuth: Scalars['Boolean'];
};

export type ProjectCreateInput = {
  allowSignup: Scalars['Boolean'];
  description: Scalars['String'];
  displayProjectName: Scalars['Boolean'];
  googleAuth: Scalars['Boolean'];
  homePage?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
  muiTheme?: InputMaybe<Scalars['JSON']>;
  name: Scalars['String'];
  redirectUrl?: InputMaybe<Scalars['String']>;
};

export type ProjectModel = {
  __typename?: 'ProjectModel';
  authMethods: ProjectAuthMethodsModel;
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  homePage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  logo?: Maybe<Scalars['String']>;
  muiTheme: Scalars['JSON'];
  name: Scalars['String'];
  redirectUrl?: Maybe<Scalars['String']>;
  settings: ProjectSettingsModel;
  updatedAt: Scalars['DateTime'];
  users: Array<UserModel>;
};

export type ProjectSettingsInput = {
  allowSignup?: InputMaybe<Scalars['Boolean']>;
  displayProjectName?: InputMaybe<Scalars['Boolean']>;
};

export type ProjectSettingsModel = {
  __typename?: 'ProjectSettingsModel';
  allowSignup: Scalars['Boolean'];
  displayProjectName: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  getProject: ProjectModel;
  getUser: UserModel;
  listProjects: Array<ProjectModel>;
  projectUsers: Array<UserModel>;
  publicKey: Array<Scalars['String']>;
  users: Array<UserModel>;
};

export type QueryGetProjectArgs = {
  id: Scalars['String'];
};

export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

export type QueryProjectUsersArgs = {
  projectId: Scalars['String'];
};

export type QueryUsersArgs = {
  projectId: Scalars['ID'];
};

export type ResetDto = {
  code: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
};

export type UserModel = {
  __typename?: 'UserModel';
  createdAt: Scalars['DateTime'];
  deletedAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  fullname: Scalars['String'];
  id: Scalars['ID'];
  projectId: Scalars['String'];
  role: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  username?: Maybe<Scalars['String']>;
};

export type UserSignupDto = {
  email: Scalars['String'];
  fullname: Scalars['String'];
  password: Scalars['String'];
  projectId: Scalars['String'];
  username?: InputMaybe<Scalars['String']>;
};

export type UsernameLoginDto = {
  password: Scalars['String'];
  projectId: Scalars['String'];
  username: Scalars['String'];
};
