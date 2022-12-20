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
