/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
  username: Types.Scalars['String'];
  password: Types.Scalars['String'];
}>;

export type SignUpEmailMutation = { __typename?: 'Mutation'; signup: { __typename?: 'AccessToken'; accessToken: string } };

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
  mutation signUpEmail($projectId: String!, $email: String!, $username: String!, $password: String!) {
    signup(user: { projectId: $projectId, email: $email, username: $username, password: $password }) {
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
 *      username: // value for 'username'
 *      password: // value for 'password'
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
