/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type PublicKeyQueryVariables = Types.Exact<{ [key: string]: never }>;

export type PublicKeyQuery = { __typename?: 'Query'; publicKey: Array<string> };

export type ForgotPasswordMutationVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
  email: Types.Scalars['String'];
}>;

export type ForgotPasswordMutation = { __typename?: 'Mutation'; forgotPassword: boolean };

export const PublicKeyDocument = gql`
  query publicKey {
    publicKey
  }
`;

/**
 * __usePublicKeyQuery__
 *
 * To run a query within a React component, call `usePublicKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `usePublicKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePublicKeyQuery({
 *   variables: {
 *   },
 * });
 */
export function usePublicKeyQuery(baseOptions?: Apollo.QueryHookOptions<PublicKeyQuery, PublicKeyQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PublicKeyQuery, PublicKeyQueryVariables>(PublicKeyDocument, options);
}
export function usePublicKeyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PublicKeyQuery, PublicKeyQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PublicKeyQuery, PublicKeyQueryVariables>(PublicKeyDocument, options);
}
export type PublicKeyQueryHookResult = ReturnType<typeof usePublicKeyQuery>;
export type PublicKeyLazyQueryHookResult = ReturnType<typeof usePublicKeyLazyQuery>;
export type PublicKeyQueryResult = Apollo.QueryResult<PublicKeyQuery, PublicKeyQueryVariables>;
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
