x install express
x run express
x download nodemon
x start nodemon
x require express
x go to localhost for sanity check
x configure mySQL database
x create config.js file (to require and connect db)
x create DB on mySQL
x save knex (if you haven't already) and run it (knex init) and file knexfile.js should pop up and update the config
x create a new migrations folder (knex migrate: nameOfFOlder)
x create migration file with tables you want to create

x yuridiary (DBname)

API Solo Project

Objectives

Create a CRUD API service using Express/GraphQL, Knex, and Postgres
Write tests for your API
Seed your database with interesting data
Be able to document your API endpoints for other developers to use, aka a beautiful README
Create a Basic/Simple frontend

Summary

You have one weekend to create an MVP (minimum viable product)
You will be doing a quick 3-5 minute presentation of your API on Monday morning and it must including a demo
Suggestions for slides:
API Endpoints
Additional Technologies Used
Challenges and Struggles Faced

Requirements

An Express server that:
has a create endpoint for adding to your database (POST)
has a read endpoint for reading from your database (GET)
has an update endpoint for editing to your database (PATCH/PUT)
has a delete endpoint for deleting from your database (DELETE)
OR a GraphQL Server that:
serves up a basic HTML file that describes your API service
Has multiple types to query
Offers mutations to delete, add, or modify data
A basic HTML file that gets served up. It should have the name of your API and link to your API's GitHub folder
Migration files
A script that will set up and seed a database
API Documentation in the form of a README.md file => https://github.com/matiassingers/awesome-readme
The top of your readme should say “This was created during my time as a student at Code Chrysalis”
A demo, but make sure to talk about what the api is about and the endpoints. Make sure your setup works!
Publish your code to Github and make it public :)

Advanced Requirements

Tests with usage of test-doubles (Spies, Mock, Fake, etc)
Deployed on Heroku (optional)
