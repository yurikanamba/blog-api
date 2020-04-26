//Imports: Express
const express = require("express");
const APP = express();

// Imports: GraphQL
const { ApolloServer } = require("apollo-server-express");
const { gql } = require("apollo-server-express");
//apollo-server-express provides the glue for serving graphql over HTTP on top of express

// initialize a connection to the database
const config = require("./config");
//const knex = require("knex")(config.db);
const knex = require("./knex/knex");

const typeDefs = gql`
  type Post {
    id: String
    title: String
    body: String
    status: String
    time: String
  }

  type Query {
    Posts: [Post]
    PostsByStatus(status: String): [Post]
  }

  type Mutation {
    AddPost(title: String, body: String, status: String): Post
    EditPost(id: String, title: String, body: String, status: String): Post
    DeletePost(id: String): DeletePost
  }

  type DeletePost {
    ok: Boolean
  }
`;

const resolvers = {
  Query: {
    Posts: () => {
      //working
      return knex("posts")
        .select()
        .orderBy("time", "desc")
        .then((posts) => {
          return posts;
        });
    },
    PostsByStatus: (parent, { status }) => {
      return knex("posts").where("status", "=", status).select();
    },
  },
  Mutation: {
    AddPost: async (parent, { title, body, status }) => {
      //working
      return knex("posts").insert({
        title: title,
        body: body,
        status: status,
      });
    },
    EditPost: async (parent, { id, title, body, status }) => {
      //working but changes the order of the posts
      return knex("posts").where("id", "=", id).update({
        title: title,
        body: body,
        status: status,
      });
    },
    DeletePost: async (parent, { id }) => {
      return knex("posts").del().where("id", "=", id);
    },
  },
};

// GraphQL: Schema
const SERVER = new ApolloServer({
  cors: true,
  typeDefs: typeDefs,
  resolvers: resolvers,
  playground: {
    endpoint: `http://localhost:4000/graphql`,
    settings: {
      "editor.theme": "light",
    },
  },
});

// Middleware: GraphQL
SERVER.applyMiddleware({
  app: APP,
});

// Express: Port
const PORT = 4000 || process.env;
const url = `http://localhost:${PORT}/graphql`;

// Express: Listener
APP.listen(PORT, () => {
  console.log(`The server has started on port: ${PORT}`);
  console.log(`http://localhost:${PORT}/graphql`);
  console.log(`🚀  Server ready at ${url}`);
});

//Apollo-Server-Express setup: https://medium.com/@jeffrey.allen.lewis/graphql-migrating-from-apollo-server-express-1-0-to-2-0-be80f5c61bee
//What is Axios: https://medium.com/@MinimalGhost/what-is-axios-js-and-why-should-i-care-7eb72b111dc0
