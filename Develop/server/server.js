require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware(req), // Ensure authMiddleware gets the request object
  introspection: true,
  persistedQueries: false
});

const startServer = async () => {
  // Start the Apollo Server
  await server.start();
  
  // Apply middleware
  app.use(cors({
    origin: '*', // Allow all origins (or specify a specific origin)
    credentials: true, // If using cookies or credentials
  }));
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Apply Apollo Server middleware
  server.applyMiddleware({ app });

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // Catch-all route to serve the main HTML file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  // Connect to the database and start the server
  db.once('open', () => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🌍 Now listening on 0.0.0.0:${PORT}`);
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Start the server
startServer();
