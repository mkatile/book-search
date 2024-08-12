const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const path = require('path');
const { typeDefs, resolvers } = require("./schemas");
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT || 3004;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  introspection: true,  // Ensure introspection is enabled
});

const startServer = async () => {
  // Start the Apollo Server
  await server.start();
  
  // Apply Apollo Server middleware
  server.applyMiddleware({ app });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve static assets if in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
  }

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startServer();