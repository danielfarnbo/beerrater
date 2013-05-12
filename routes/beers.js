var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    database = 'beerdb_dev';

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db(database, server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to " + database + " database");
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
                    //req.session.user_id = result[0]._id;
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
    if (rating.user && rating.rating && rating.beernr && isNumber(rating.rating)) {
        rating = {
            'user': rating.user,
            'rating': parseInt(rating.rating, 10),
            'beernr': rating.beernr
            };
        db.collection('users', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(rating.user)}, function(err, item) {
                if(!err && item && item.name) {
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

exports.totalRatings = function(req, res) {
    var collection = db.collection('ratings');
    collection.aggregate([
        {
            $group: {
                _id: '$beernr',
                votes : { $sum : 1 },
                points: {$sum: '$rating'}
            }
        }//,
        //{
            // sort by the new points field
            //$sort: {
                //"points" : -1
            //}
        //}
    ], function (err, results) {
        db.collection('beers', function(err, collection) {
            collection.find().toArray(function(err, beers) {
                for (var i = results.length; i > 0; i--) {
                    for (var j = beers.length; j > 0; j--) {
                        if(results[i-1]._id === beers[j-1].beernr) {
                            results[i-1].beername = beers[j-1].name;
                        }
                    }
                    results[i-1].calculated = Math.round(results[i-1].points / results[i-1].votes);
                }
                res.send(results);
            });
        });
    });
};

exports.userRatingsDiff = function(req, res) {
    var collection = db.collection('ratings'),
    aggregatedRatings,
    allRatings,
    finalResult = [];
    collection.aggregate([
        {
            $group: {
                _id: '$beernr',
                votes : { $sum : 1 },
                points: {$sum: '$rating'}
            }
        }
    ], function (err, results) {
        db.collection('beers', function(err, collection) {
            collection.find().toArray(function(err, beers) {
                for (var i = results.length; i > 0; i--) {
                    for (var j = beers.length; j > 0; j--) {
                        if(results[i-1]._id === beers[j-1].beernr) {
                            results[i-1].beername = beers[j-1].name;
                        }
                    }
                    results[i-1].calculated = Math.round(results[i-1].points / results[i-1].votes);
                }
                aggregatedRatings = results;
                db.collection('ratings', function(err, collection) {
                    collection.find().toArray(function(err, items) {
                        allRatings = items;
                        db.collection('users', function(err, collection) {
                            collection.find().toArray(function(err, users) {
                                for (var i = users.length; i > 0; i--) {
                                    userDiff = {
                                        'user': users[i-1],
                                        'uSuckValue': 0
                                    };
                                    for (var j = allRatings.length; j > 0; j--) {
                                        for (var k = aggregatedRatings.length; k > 0; k--) {
                                            if (aggregatedRatings[k-1]._id === allRatings[j-1].beernr && allRatings[j-1].user === users[i-1]._id+''){
                                                userDiff.uSuckValue += Math.abs(aggregatedRatings[k-1].calculated - allRatings[j-1].rating);
                                            }
                                        }
                                    }
                                    finalResult.push(userDiff);
                                }
                                res.send(finalResult);
                            });
                        });
                    });
                });
            });
        });
    });
};

exports.findRatingByBeerIdAndUserId = function(req, res) {
    var beerno = req.params.beerno,
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
    rating.rating = parseInt(rating.rating, 10);
    delete rating._id;
    console.log('Updating rating: ' + id);
    console.log(JSON.stringify(rating));
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(rating.user)}, function(err, item) {
            if(!err && item && item.name) {
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
            } else {
                res.send('Rating not allowed. err: ' + err + ' user: ' + item);
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
        name: "Utopias",
        picture: "utopias.png",
        abv: "27",
        brewery: "Samuel Adams",
        beernr: "1"
    },
    {
        name: "Envy",
        abv: "6.5",
        picture: "amager.png",
        brewery: "Amager Brygghus",
        beernr: "2"
    },
    {
        name: "Tjockhult Tjinook",
        picture: "tjockhult.png",
        abv: "5.1",
        brewery: "Nynäshamns Ångbryggeri",
        beernr: "3"
    },
    {
        name: "Saison de Dottignies",
        picture: "dottignies.png",
        abv: "6.0",
        brewery: "?",
        beernr: "4"
    },
    {
        name: "Hell",
        picture: "hell.png",
        abv: "5.1",
        brewery: "Jämtlands Bryggeri",
        beernr: "5"
    },
    {
        name: "Mysingen Midvinterbrygd",
        picture: "mysingen.jpg",
        abv: "6.0",
        brewery: "Nynäshamns Ångbryggeri AB",
        beernr: "6"
    },
    {
        name: "K:rlek vår/sommar 2013",
        picture: "krlek13.png",
        abv: "5.5",
        brewery: "Mikkeller",
        beernr: "7"
    },
    {
        name: "Sans Frontier",
        picture: "frontier.png",
        abv: "7.0",
        brewery: "To Øl",
        beernr: "8"
    },
    {
        name: "Spontan Cherry Fredriksdal",
        picture: "spontan.png",
        abv: "6.2",
        brewery: "Mikkeller",
        beernr: "9"
    },
    {
        name: "Valeir Blonde",
        picture: "valeir.png",
        abv: "6.5",
        brewery: "?",
        beernr: "10"
    },
    {
        name: "Tindved",
        picture: "tindved.png",
        abv: "7.0",
        brewery: "Nøgne Ø",
        beernr: "11"
    },
    {
        name: "Bedarö Bitter",
        picture: "bedaro.png",
        abv: "4.5",
        brewery: "Nynäshamns Ångbryggeri",
        beernr: "12"
    }];

    db.collection('beers', function(err, collection) {
        collection.insert(beers, {safe:true}, function(err, result) {});
    });

};