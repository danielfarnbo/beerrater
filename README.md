G.I.B.B Bonanza Super Responsive Bootstrap Backbone Mobile Beer Rater
=====================================================================


To run the REST-API:
--------------------

- Install Node.js

- Install MongoDB

- Install MongoDB Node.js driver by running "npm install mongodb"

- Go to /beerrater dir and run "npm install" to install express and other stuff we need

- Start MongoDB by running "mongod"

- Start the application by running "node server.js" in the /beerrater dir

- Now the application is running on http://localhost:3000, try it by going to http://localhost:3000/beers


API consists of
---------------

GET '/beers', get all beers

GET '/beers/:id', get beer by id

GET '/beers/nr/:beerno', get beer by beerno

POST '/ratings', add rating

GET '/ratings', get all ratings

GET '/ratings/:beernr/:userid', get rating by userid and beernr

PUT /ratings/:id, update rating

POST '/users', add user

GET '/users', get all users

GET '/users/:id', get user by id (maybe not necessary?)


TODO
----

PUT /users, update user

GET /ratings/total, get calculated total ratings per beer

GET /users/winner, get the user who's ratings are closest to the calculated total


Links
-----

Some good instructions here: http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
