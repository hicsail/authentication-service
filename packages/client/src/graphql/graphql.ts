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
  _Any: any;
  federation__FieldSet: any;
  link__Import: any;
};

/** Input type for accepting an invite */
export type AcceptInviteModel = {
  /** The email address of the user accepting the invite */
  email: Scalars['String'];
  /** The full name of the user accepting the invite */
  fullname: Scalars['String'];
  /** The invite code that was included in the invite email */
  inviteCode: Scalars['String'];
  /** The password for the new user account */
  password: Scalars['String'];
  /** The ID of the project the invite is associated with */
  projectId: Scalars['String'];
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

export type InviteModel = {
  __typename?: 'InviteModel';
  /** The date and time at which the invitation was created. */
  createdAt: Scalars['DateTime'];
  /** The date and time at which the invitation was deleted, if applicable. */
  deletedAt?: Maybe<Scalars['DateTime']>;
  /** The email address of the user being invited. */
  email: Scalars['String'];
  /** The date and time at which the invitation expires. */
  expiresAt: Scalars['DateTime'];
  /** The ID of the invitation. */
  id: Scalars['ID'];
  /** The ID of the project to which the invitation belongs. */
  projectId: Scalars['String'];
  /** The role that the user being invited will have. */
  role: Scalars['Int'];
  /** The status of the invitation. */
  status: InviteStatus;
  /** The date and time at which the invitation was last updated. */
  updatedAt: Scalars['DateTime'];
};

/** The status of an invite */
export enum InviteStatus {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Pending = 'PENDING'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptInvite: InviteModel;
  cancelInvite: InviteModel;
  createInvite: InviteModel;
  createProject: ProjectModel;
  forgotPassword: Scalars['Boolean'];
  loginEmail: AccessToken;
  loginUsername: AccessToken;
  resendInvite: InviteModel;
  resetPassword: Scalars['Boolean'];
  signup: AccessToken;
  updateProject: ProjectModel;
  updateProjectAuthMethods: ProjectModel;
  updateProjectSettings: ProjectModel;
};

export type MutationAcceptInviteArgs = {
  input: AcceptInviteModel;
};

export type MutationCancelInviteArgs = {
  id: Scalars['ID'];
};

export type MutationCreateInviteArgs = {
  email: Scalars['String'];
  role?: InputMaybe<Scalars['Int']>;
};

export type MutationCreateProjectArgs = {
  authServiceUser: UsernameLoginDto;
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

export type MutationResendInviteArgs = {
  id: Scalars['ID'];
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
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  getProject: ProjectModel;
  getUser: UserModel;
  invite: InviteModel;
  invites: Array<InviteModel>;
  listProjects: Array<ProjectModel>;
  projectUsers: Array<UserModel>;
  publicKey: Array<Scalars['String']>;
  users: Array<UserModel>;
};

export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']>;
};

export type QueryGetProjectArgs = {
  id: Scalars['String'];
};

export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

export type QueryInviteArgs = {
  id: Scalars['ID'];
};

export type QueryInvitesArgs = {
  status?: InputMaybe<InviteStatus>;
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
  fullname?: Maybe<Scalars['String']>;
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

export type _Entity = InviteModel | ProjectModel | UserModel;

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}
