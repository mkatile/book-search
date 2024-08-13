import React from 'react';
import { ApolloProvider, InMemoryCache, createHttpLink, ApolloClient } from '@apollo/client';

import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link to connect to your Apollo Server
const httpLink = createHttpLink({
  uri: '/graphql', 
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet/>
    </ApolloProvider>
  );
}

export default App;

