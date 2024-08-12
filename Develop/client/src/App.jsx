import React from 'react';
import { ApolloProvider, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

// Create an HTTP link to connect to your Apollo Server
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql', 
});

// Optional: Add authentication or other middleware if needed
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem('token');
  
  // Use the token if it exists
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

// Combine the authentication link with the HTTP link
const link = authLink.concat(httpLink);

// Create the Apollo Client instance
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;

