const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql/schema');
const contentRoutes = require('./routes/content');

const app = express();
app.use(express.json());
app.use('/api', contentRoutes);

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // 👇 Écoute sur le port 4000
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(` Gateway listening at http://localhost:${PORT}`);
    console.log(` GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();

module.exports = app;
