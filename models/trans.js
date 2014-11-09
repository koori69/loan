/**
 * Created by lambert on 14/11/6.
 */
var mongodb = require("./db");

function Trans(trans) {
    this.funder = trans.funder;
    this.type = trans.type; // in or out
    this.amount = trans.amount;
    this.date = trans.date;
}

if (typeof transType == "undefined") {
    var transType = {};
    transType.IN = "IN";
    transType.OUT = "OUT";
}

module.exports = Trans;

Trans.prototype.save = function save(callback) {
    var trans = {
        funder: this.funder,
        type: this.type,
        amount: Number(this.amount),
        date: this.date
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        console.log("Open MongoDB succeed.");
        db.collection("transaction", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
//            collection.ensureIndex
            console.log("Open collection succeed.");
            collection.insert(trans, {safe: true}, function(err, trans) {
                mongodb.close();
                callback(err, trans);
            });
        });
    });
};

Trans.get = function get(name, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        console.log("Trans.get, Open MongoDB succeed.");
        db.collection('transaction', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.find({funder: name}).toArray(function (err, docs) {
                mongodb.close();
                if (docs) {
                    callback(err, docs);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

Trans.getAll = function getAll(callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        console.log("Trans.getAll, Open MongoDB succeed.");
        db.collection('transaction', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            collection.find().toArray(function (err, docs) {
                mongodb.close();
                if (docs) {
                    callback(err, docs);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};

//Trans.withdraw = function withdraw(name, callback) {
//    mongodb.open(function(err, db) {
//        if (err) {
//            return callback(err);
//        }
//
//        console.log("Open MongoDB succeed.");
//        db.collection('transaction', function (err, collection) {
//            if (err) {
//                mongodb.close();
//                return callback(err);
//            }
//
//            collection.findOne({funder: name}, function (err, doc) {
//                mongodb.close();
//                if (doc) {
//                    var trans = new Trans(doc);
//                    callback(err, trans);
//                } else {
//                    callback(err, null);
//                }
//            });
//        });
//    });
//};