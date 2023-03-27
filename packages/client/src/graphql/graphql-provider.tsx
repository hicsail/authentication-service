import React, { FC } from 'react';
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from '@apollo/client';

const uri = `${import.meta.env.VITE_AUTH_URL}/graphql`;

export interface GraphqlProviderProps {
  children: React.ReactNode;
}

export const GraphqlProvider: FC<GraphqlProviderProps> = ({ children }) => {
  const httpLink = new HttpLink({
    fetch: fetch,
    uri
  });
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache({
      resultCaching: true
    }),
    link: from([httpLink]),
    defaultOptions: {
      query: {
        errorPolicy: 'ignore',
        returnPartialData: true
      }
    }
  });
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
