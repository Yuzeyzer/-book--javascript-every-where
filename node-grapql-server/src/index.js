// index.js
// This is the main entry point of our application
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

let notes = [
  {
    id: '1',
    content: 'This is a note',
    author: 'Adam Scott'
  },
  {
    id: '2',
    content: 'This is another note',
    author: 'Harlow Everly'
  },
  {
    id: '3',
    content: 'Oh hey look, another note!',
    author: 'Riley Harrison'
  }
];

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
    notes: () => notes,
    note: (parent, args) => notes.find(note => note.id === args.id)
  },
  Mutation: {
    newNote: (parent, args) => {
      const newNote = {
        id: String(notes.length + 1),
        content: args.content,
        author: 'Yuzeyzer'
      };
      notes.push(newNote);
      return newNote;
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
