/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type ProjectUsersQueryVariables = Types.Exact<{
  projectId: Types.Scalars['String'];
}>;

export type ProjectUsersQuery = {
  __typename?: 'Query';
  projectUsers: Array<{ __typename?: 'UserModel'; id: string; username?: string | null; email?: string | null; role: number }>;
};

export const ProjectUsersDocument = gql`
  query projectUsers($projectId: String!) {
    projectUsers(projectId: $projectId) {
      id
      username
      email
      role
    }
  }
`;

/**
 * __useProjectUsersQuery__
 *
 * To run a query within a React component, call `useProjectUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectUsersQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useProjectUsersQuery(baseOptions: Apollo.QueryHookOptions<ProjectUsersQuery, ProjectUsersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ProjectUsersQuery, ProjectUsersQueryVariables>(ProjectUsersDocument, options);
}
export function useProjectUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProjectUsersQuery, ProjectUsersQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ProjectUsersQuery, ProjectUsersQueryVariables>(ProjectUsersDocument, options);
}
export type ProjectUsersQueryHookResult = ReturnType<typeof useProjectUsersQuery>;
export type ProjectUsersLazyQueryHookResult = ReturnType<typeof useProjectUsersLazyQuery>;
export type ProjectUsersQueryResult = Apollo.QueryResult<ProjectUsersQuery, ProjectUsersQueryVariables>;
