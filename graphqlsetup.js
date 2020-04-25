const config = require("./config");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const dummyData = require("./data.json");

// initialize a connection to the database
const knex = require("knex")(config.db);

const schema = buildSchema(`
type Post {
    id: String
    title: String
    body:  String
    status: String
    time: String
}

input PostInput {
    id: String
    title: String
    body:  String
    status: String
    publishDate: String
    tags: [String]
}

 type Query {
    Posts: [Post]
    PostsByStatus(status: String): [Post]
    PostsByTag(tag: String): [Post]
}

  type Mutation {
    AddPost(input: PostInput): [Post]
    EditPost(id: String, input: PostInput): [Post]
    DeletePost(id: String): [Post]
  }
 `);

const resolvers = {
  Posts: () => {
    //working
    return knex("posts")
      .select()
      .then((posts) => {
        return posts;
      });
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
};

// Start express server
const app = express();

/*
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. 
*/
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});
