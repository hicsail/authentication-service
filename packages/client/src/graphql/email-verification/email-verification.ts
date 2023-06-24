/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetEmailVerificationStatusQueryVariables = Types.Exact<{
  accessToken: Types.Scalars['String'];
}>;

export type GetEmailVerificationStatusQuery = { __typename?: 'Query'; getEmailVerificationStatus: boolean };

export const GetEmailVerificationStatusDocument = gql`
  query getEmailVerificationStatus($accessToken: String!) {
    getEmailVerificationStatus(user: { accessToken: $accessToken })
  }
`;

/**
 * __useGetEmailVerificationStatusQuery__
 *
 * To run a query within a React component, call `useGetEmailVerificationStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEmailVerificationStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEmailVerificationStatusQuery({
 *   variables: {
 *      accessToken: // value for 'accessToken'
 *   },
 * });
 */
export function useGetEmailVerificationStatusQuery(baseOptions: Apollo.QueryHookOptions<GetEmailVerificationStatusQuery, GetEmailVerificationStatusQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetEmailVerificationStatusQuery, GetEmailVerificationStatusQueryVariables>(GetEmailVerificationStatusDocument, options);
}
export function useGetEmailVerificationStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEmailVerificationStatusQuery, GetEmailVerificationStatusQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetEmailVerificationStatusQuery, GetEmailVerificationStatusQueryVariables>(GetEmailVerificationStatusDocument, options);
}
export type GetEmailVerificationStatusQueryHookResult = ReturnType<typeof useGetEmailVerificationStatusQuery>;
export type GetEmailVerificationStatusLazyQueryHookResult = ReturnType<typeof useGetEmailVerificationStatusLazyQuery>;
export type GetEmailVerificationStatusQueryResult = Apollo.QueryResult<GetEmailVerificationStatusQuery, GetEmailVerificationStatusQueryVariables>;
