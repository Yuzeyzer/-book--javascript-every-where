require('dotenv').config();

// index.js
// This is the main entry point of our application
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

db.connect(process.env.DB_HOST);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {
      models
    };
  }
});

const app = express();
const port = process.env.PORT || 4000;

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello World!!!'));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
