var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('beerdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'beerdb' database");
        db.collection('beers', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'beers' collection doesn't exist. Creating it with sample data...");
                populateBeerDB();
            }
        });


        db.collection('ratings', {}, function(err, collection) {
            collection.ensureIndex({'user': 1, 'beernr': 1}, {unique: true});        
        });

        db.collection('users', {}, function(err, collection) {
            collection.ensureIndex({'name': 1}, {unique: true});    
        });

    }
});

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving beer: ' + id);
    db.collection('beers', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByBeerNr = function(req, res) {
    var beerno = parseInt(req.params.beerno, 10);
    console.log('Retrieving beer: ' + beerno);
    db.collection('beers', function(err, collection) {
        collection.findOne({'beernr': beerno}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('beers', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function(req, res) {
    var user = req.body;
    if (user.name) {
        user = {"name": user.name};
        console.log('Adding user: ' + JSON.stringify(user));
        db.collection('users', function(err, collection) {
            collection.insert(user, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    req.session.user_id = result[0]._id;
                    res.send(result[0]);
                }
            });
        });
    } else {
        console.warn('malformed input: ', user);
    }
};

exports.findAllUsers = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findUserById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.isUserLogedIn = function(req, res, next) { //TODO this should be handled by findUserById, but how?
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            next(item);      
        });
    });
};

exports.addRating = function(req, res) {
    var rating = req.body;
    if (rating.user && rating.rating && rating.beernr && isNumber(rating.rating) && isNumber(rating.beernr)) {
        rating = {
            'user': rating.user,
            'rating': Math.round(rating.rating),
            'beernr': Math.round(rating.beernr)
            };
        db.collection('users', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(rating.user)}, function(err, item) {
                if(!err && item) {
                            console.log('Adding rating: ' + JSON.stringify(rating));
                            db.collection('ratings', function(err, collection) {
                                collection.insert(rating, {safe:true}, function(err, result) {
                                    if (err) {
                                        res.send({'error':'An error has occurred'});
                                    } else {
                                        console.log('Success: ' + JSON.stringify(result[0]));
                                        res.send(result[0]);
                                    }
                                });
                            });
                } else {
                    res.send('Rating not allowed. err: ' + err + ' user: ' + item);
                }
            });
        });
    } else {
        console.warn('malformed input: ', rating);
    }
};

exports.findAllRatings = function(req, res) {
    db.collection('ratings', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findRatingByBeerIdAndUserId = function(req, res) {
    var beerno = parseInt(req.params.beerno, 10),
        userid = req.params.userid;
    console.log('Retrieving rating: ', beerno, userid);
    db.collection('ratings', function(err, collection) {
        collection.findOne({'beernr': beerno, 'user': userid}, function(err, item) {
            res.send(item);
        });
    });
};

exports.updateRating = function(req, res) {
    var id = req.params.id;
    var rating = req.body;
    delete rating._id;
    console.log('Updating rating: ' + id);
    console.log(JSON.stringify(rating));
    db.collection('ratings', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, rating, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating rating: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' rating updated');
                res.send(rating);
            }
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateBeerDB = function() {

    var beers = [
    {
        name: "Oppigårds Winter Ale",
        picture: "saint_cosme.jpg",
        abv: 5.9,
        brewery: "Oppigårds",
        beernr: 1
    },
    {
        name: "Jólabjór",
        abv: 5.9,
        picture: "saint_cosme.jpg",
        brewery: "Ölvisholt Brugghús",
        beernr: 2
    },
    {
        name: "Anchor Christmas Ale",
        picture: "saint_cosme.jpg",
        abv: 5.5,
        brewery: "Anchor Brewing",
        beernr: 3
    }];

    db.collection('beers', function(err, collection) {
        collection.insert(beers, {safe:true}, function(err, result) {});
    });

};