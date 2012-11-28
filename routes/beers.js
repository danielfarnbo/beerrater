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
        // db.collection('ratings', {safe:true}, function(err, collection) {
        //     if (err) {
        //         console.log("The 'ratings' collection doesn't exist. Creating it with sample data...");
        //         populateRatingDB();
        //     }
        // });
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
    var beerno = req.params.beerno;
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

// exports.addBeer = function(req, res) {
//     var beer = req.body;
//     console.log('Adding beer: ' + JSON.stringify(beer));
//     db.collection('beers', function(err, collection) {
//         collection.insert(beer, {safe:true}, function(err, result) {
//             if (err) {
//                 res.send({'error':'An error has occurred'});
//             } else {
//                 console.log('Success: ' + JSON.stringify(result[0]));
//                 res.send(result[0]);
//             }
//         });
//     });
// }

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

// exports.updateBeer = function(req, res) {
//     var id = req.params.id;
//     var beer = req.body;
//     delete beer._id;
//     console.log('Updating beer: ' + id);
//     console.log(JSON.stringify(beer));
//     db.collection('beers', function(err, collection) {
//         collection.update({'_id':new BSON.ObjectID(id)}, beer, {safe:true}, function(err, result) {
//             if (err) {
//                 console.log('Error updating beer: ' + err);
//                 res.send({'error':'An error has occurred'});
//             } else {
//                 console.log('' + result + ' document(s) updated');
//                 res.send(beer);
//             }
//         });
//     });
// };

// exports.deleteBeer = function(req, res) {
//     var id = req.params.id;
//     console.log('Deleting beer: ' + id);
//     db.collection('beers', function(err, collection) {
//         collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
//             if (err) {
//                 res.send({'error':'An error has occurred - ' + err});
//             } else {
//                 console.log('' + result + ' document(s) deleted');
//                 res.send(req.body);
//             }
//         });
//     });
// }

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
                    res.send('rating not allowed. err: ' + err + ' user: ' + item);
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
        beernr: "0"
    },
    {
        name: "Jólabjór",
        abv: 5.9,
        picture: "saint_cosme.jpg",
        brewery: "Ölvisholt Brugghús",
        beernr: "1"
    },
    {
        name: "Anchor Christmas Ale",
        picture: "saint_cosme.jpg",
        abv: 5.5,
        brewery: "Anchor Brewing",
        beernr: "3"
    }];

    db.collection('beers', function(err, collection) {
        collection.insert(beers, {safe:true}, function(err, result) {});
    });

};

// var populateRatingDB = function() {

//     var ratings = [
//     {
//         user: 1234,
//         rating: 4,
//         beernr: 0
//     },
//     {
//         user: 5678,
//         rating: 99,
//         beernr: 1
//     }];

//     db.collection('ratings', function(err, collection) {
//         collection.insert(ratings, {safe:true}, function(err, result) {});
//     });

// };