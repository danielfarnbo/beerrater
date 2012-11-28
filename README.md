G.I.B.B Responsive Backbone Nodejs Beerrater
============================================


To run the REST-API:
--------------------

- Install Node.js

- Install MongoDB

- Install mongoDB Node.js driver by running "npm install mongodb"

- Go to /beerrater dir and run "npm install" to install express and other stuff we need

- Start MongoDB by running "mongod"

- Start the application by running "node server.js" in the /beerrater dir


API consists of
---------------

GET '/beers', get all beers

GET '/beers/:id', get beer by id

GET '/beers/nr/:beerno', get beer by beerno

POST '/ratings', add rating

GET '/ratings', get all ratings

POST '/users', add user

GET '/users', get all users

GET '/users/:id', get user by id (maybe not necessary?)


TODO
----

PUT /ratings, update rating

PUt /users, update user


Some good instructions here: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
