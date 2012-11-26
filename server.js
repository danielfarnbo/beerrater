var express = require('express'),
    path = require('path'),
    http = require('http'),
    beer = require('./routes/beers');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/beers', beer.findAll);
app.get('/beers/:id', beer.findById);
app.post('/beers', beer.addWine);
app.put('/beers/:id', beer.updateWine);
app.delete('/beers/:id', beer.deleteWine);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
