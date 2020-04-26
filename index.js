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

  input PostInput {
    id: String
    title: String
    body: String
    status: String
    publishDate: String
    tags: [String]
  }

  type Query {
    Posts: [Post]
    PostsByStatus(status: String): [Post]
    PostsByTag(tag: String): [Post]
  }

  type DeletePost {
    ok: Boolean
  }

  type Mutation {
    AddPost(input: PostInput): [Post]
    EditPost(id: String, input: PostInput): [Post]
    DeletePost(id: String): DeletePost
  }
`;

const resolvers = {
  Query: {
    Posts: () => {
      //working
      return knex("posts")
        .select()
        .then((posts) => {
          return posts;
        });
    },
  },
  //come back to these for additional functionality
  // PostsByStatus: (request) => {
  //   const posts = [];
  //   dummyData.posts.forEach((post) => {
  //     if (post.status === request.status) {
  //       posts.push(post);
  //     }
  //   });
  //   return posts;
  // },
  // PostsByTag: (request) => {
  //   const posts = [];
  //   dummyData.posts.forEach((post) => {
  //     if (post.tags.includes(request.tag)) {
  //       posts.push(post);
  //     }
  //   });
  //   return posts;
  // },
  Mutation: {
    AddPost: async (request) => {
      //working
      return knex("posts").insert({
        title: request.input.title,
        body: request.input.body,
        status: request.input.status,
      });
    },
    EditPost: async (request) => {
      //working but changes the order of the posts
      return knex("posts").where("id", "=", request.id).update({
        title: request.input.title,
        body: request.input.body,
        status: request.input.status,
      });
    },
    DeletePost: async (request) => {
      //working
      return knex("posts").del().where("id", "=", request.id);
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
