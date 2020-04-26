exports.up = function (knex) {
  return knex.schema.createTable("posts", (t) => {
    t.increments().index();

    t.string("title").notNullable().index(); //not sure what this actually does

    t.string("body").notNullable();

    t.string("time").notNullable().defaultTo(knex.fn.now());
    // default to the current time

    t.string("status").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("posts");
};
