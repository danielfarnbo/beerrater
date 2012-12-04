var express = require('express'),
    path = require('path'),
    http = require('http'),
    beer = require('./routes/beers');

var app = express();

var integer = function (v) {
	return parseInt(v, 10);
}

var checkLogin = function (req, res, next) {
	console.log('check login');
	if (req.session.user_id) {
		req.params.id = req.session.user_id;
	    beer.isUserLoggedIn(req, res, next, function(user) {
			if (user) {
				req.currentUser = user;
				console.log('Logged in as ', user.name);
				next();
			} else {
				res.redirect('/frontend/index.html');
			}
		});
	} else {
		res.redirect('/frontend/index.html');
	}
}


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'FASTFIVEFOREVER!!!'}));
    app.use(express.static(path.join(__dirname, 'public')));
});

// app.param(':beerno', integer); Y DIS NO WORK?

app.get('/hello', function(req, res){
  res.send('Hello World');
});
app.get('/beers', checkLogin, beer.findAll);
app.get('/beers/:id', checkLogin, beer.findById);
app.get('/beers/nr/:beerno', checkLogin, beer.findByBeerNr);
app.post('/ratings', checkLogin, beer.addRating);
app.get('/ratings', checkLogin, beer.findAllRatings);
app.get('/ratings/:beerno/:userid', checkLogin, beer.findRatingByBeerIdAndUserId);
app.put('/ratings/:id', checkLogin, beer.updateRating);
app.post('/users', beer.addUser);
app.get('/users', beer.findAllUsers);
app.get('/users/:id', beer.findUserById);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
