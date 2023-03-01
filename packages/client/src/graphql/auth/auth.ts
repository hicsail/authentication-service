/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import * as Apollo from '@apollo/client';
import {gql} from '@apollo/client';

const defaultOptions = {} as const;
export type LoginEmailMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;

export type LoginEmailMutation = { __typename?: 'Mutation'; loginEmail: { __typename?: 'AccessToken'; accessToken: string } };

export type SignUpEmailMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  email: Types.Scalars['String'];
  password: Types.Scalars['String'];
  username?: Types.InputMaybe<Types.Scalars['String']>;
}>;

export type SignUpEmailMutation = { __typename?: 'Mutation'; signup: { __typename?: 'AccessToken'; accessToken: string } };

export type ForgotPasswordMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  email: Types.Scalars['String'];
}>;

export type ForgotPasswordMutation = { __typename?: 'Mutation'; forgotPassword: boolean };

export type ResetPasswordMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  email: Types.Scalars['String'];
  code: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;

export type ResetPasswordMutation = { __typename?: 'Mutation'; resetPassword: boolean };

export const LoginEmailDocument = gql`
  mutation loginEmail($projectId: String!, $email: String!, $password: String!) {
    loginEmail(user: { projectId: $projectId, email: $email, password: $password }) {
      accessToken
    }
  }
`;
export type LoginEmailMutationFn = Apollo.MutationFunction<LoginEmailMutation, LoginEmailMutationVariables>;

/**
 * __useLoginEmailMutation__
 *
 * To run a mutation, you first call `useLoginEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginEmailMutation, { data, loading, error }] = useLoginEmailMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginEmailMutation(baseOptions?: Apollo.MutationHookOptions<LoginEmailMutation, LoginEmailMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginEmailMutation, LoginEmailMutationVariables>(LoginEmailDocument, options);
}
export type LoginEmailMutationHookResult = ReturnType<typeof useLoginEmailMutation>;
export type LoginEmailMutationResult = Apollo.MutationResult<LoginEmailMutation>;
export type LoginEmailMutationOptions = Apollo.BaseMutationOptions<LoginEmailMutation, LoginEmailMutationVariables>;
export const SignUpEmailDocument = gql`
  mutation signUpEmail($projectId: String!, $email: String!, $password: String!, $username: String) {
    signup(user: { projectId: $projectId, email: $email, password: $password, username: $username }) {
      accessToken
    }
  }
`;
export type SignUpEmailMutationFn = Apollo.MutationFunction<SignUpEmailMutation, SignUpEmailMutationVariables>;

/**
 * __useSignUpEmailMutation__
 *
 * To run a mutation, you first call `useSignUpEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpEmailMutation, { data, loading, error }] = useSignUpEmailMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useSignUpEmailMutation(baseOptions?: Apollo.MutationHookOptions<SignUpEmailMutation, SignUpEmailMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SignUpEmailMutation, SignUpEmailMutationVariables>(SignUpEmailDocument, options);
}
export type SignUpEmailMutationHookResult = ReturnType<typeof useSignUpEmailMutation>;
export type SignUpEmailMutationResult = Apollo.MutationResult<SignUpEmailMutation>;
export type SignUpEmailMutationOptions = Apollo.BaseMutationOptions<SignUpEmailMutation, SignUpEmailMutationVariables>;
export const ForgotPasswordDocument = gql`
  mutation forgotPassword($projectId: String!, $email: String!) {
    forgotPassword(user: { projectId: $projectId, email: $email })
  }
`;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
}
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
  mutation resetPassword($projectId: String!, $email: String!, $code: String!, $password: String!) {
    resetPassword(user: { projectId: $projectId, email: $email, code: $code, password: $password })
  }
`;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *      email: // value for 'email'
 *      code: // value for 'code'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
}
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
