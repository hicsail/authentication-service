/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AcceptInviteMutationVariables = Types.Exact<{
  input: Types.AcceptInviteModel;
}>;

export type AcceptInviteMutation = { __typename?: 'Mutation'; acceptInvite: { __typename?: 'InviteModel'; id: string } };

export type GetInviteQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;

export type GetInviteQuery = { __typename?: 'Query'; invite: { __typename?: 'InviteModel'; projectId: string; status: Types.InviteStatus } };

export const AcceptInviteDocument = gql`
  mutation acceptInvite($input: AcceptInviteModel!) {
    acceptInvite(input: $input) {
      id
    }
  }
`;
export type AcceptInviteMutationFn = Apollo.MutationFunction<AcceptInviteMutation, AcceptInviteMutationVariables>;

/**
 * __useAcceptInviteMutation__
 *
 * To run a mutation, you first call `useAcceptInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInviteMutation, { data, loading, error }] = useAcceptInviteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAcceptInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInviteMutation, AcceptInviteMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AcceptInviteMutation, AcceptInviteMutationVariables>(AcceptInviteDocument, options);
}
export type AcceptInviteMutationHookResult = ReturnType<typeof useAcceptInviteMutation>;
export type AcceptInviteMutationResult = Apollo.MutationResult<AcceptInviteMutation>;
export type AcceptInviteMutationOptions = Apollo.BaseMutationOptions<AcceptInviteMutation, AcceptInviteMutationVariables>;
export const GetInviteDocument = gql`
  query getInvite($id: ID!) {
    invite(id: $id) {
      projectId
      status
    }
  }
`;

/**
 * __useGetInviteQuery__
 *
 * To run a query within a React component, call `useGetInviteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInviteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInviteQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInviteQuery(baseOptions: Apollo.QueryHookOptions<GetInviteQuery, GetInviteQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetInviteQuery, GetInviteQueryVariables>(GetInviteDocument, options);
}
export function useGetInviteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInviteQuery, GetInviteQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetInviteQuery, GetInviteQueryVariables>(GetInviteDocument, options);
}
export type GetInviteQueryHookResult = ReturnType<typeof useGetInviteQuery>;
export type GetInviteLazyQueryHookResult = ReturnType<typeof useGetInviteLazyQuery>;
export type GetInviteQueryResult = Apollo.QueryResult<GetInviteQuery, GetInviteQueryVariables>;
