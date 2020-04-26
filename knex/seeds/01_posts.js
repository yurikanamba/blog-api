//insert initial data into database
const posts = require("../../posts");

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("posts")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("posts").insert(posts);
    });
};
