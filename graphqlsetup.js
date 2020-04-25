const config = require("./config");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const dummyData = require("./data.json");

//get data from DB
const knex = require("knex")(config.db);
const models = require("./models")(knex);

const schema = buildSchema(`
type Post {
    id: String
    title: String
    body:  String
    status: String
    publishDate: String
    tags: [String]
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
    return dummyData.posts;
  },
  PostsByStatus: (request) => {
    const posts = [];
    dummyData.posts.forEach((post) => {
      if (post.status === request.status) {
        posts.push(post);
      }
    });
    return posts;
  },
  PostsByTag: (request) => {
    const posts = [];
    dummyData.posts.forEach((post) => {
      if (post.tags.includes(request.tag)) {
        posts.push(post);
      }
    });
    return posts;
  },
  AddPost: (request) => {
    const post = Object.assign({}, request.input);
    dummyData.posts.push(post);
    return dummyData.posts;
  },
  EditPost: (request) => {
    dummyData.posts.forEach((post) => {
      if (post.id === request.id) {
        Object.assign(post, request.input);
      }
    });
    return dummyData.posts;
  },
  DeletePost: (request) => {
    dummyData.posts.forEach((post, index) => {
      if (request.id === post.id) {
        dummyData.posts.splice(index, 1);
      }
    });
    return dummyData.posts;
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
