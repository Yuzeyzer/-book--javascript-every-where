require('dotenv').config();

// index.js
// This is the main entry point of our application
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./db');
const models = require('./models');

db.connect(process.env.DB_HOST);

const typeDefs = gql`
  type Note {
    id: ID!
    content: String!
    author: String!
  }
  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID!): Note!
  }
  type Mutation {
    newNote(content: String!): Note!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    notes: async () => await models.Note.find(),
    note: async (parent, args) => models.Note.findById(args.id)
  },
  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: 'Yuzeyzer'
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
const port = process.env.PORT || 4000;

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Hello World!!!'));

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);
