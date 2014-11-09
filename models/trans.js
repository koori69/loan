/**
 * Created by lambert on 14/11/6.
 */
var mongodb = require("./db");

function Trans(trans) {
    this.owner = trans.owner;
    this.type = trans.type; // in or out
    this.amount = trans.amount;
    this.fee = trans.fee;
    this.date = trans.date;
    this.reserved = trans.reserved;
    this.reserve_date = trans.reserve_date;
}

if (typeof transType == "undefined") {
    var transType = {};
    transType.IN = "IN";
    transType.OUT = "OUT";
}

module.exports = Trans;

Trans.prototype.save = function save(callback) {
    var trans = {
        owner: this.owner,
        type: this.type,
        amount: Number(this.amount),
        fee: this.fee,
        reserved: this.reserved,
        date: this.date,
        reserved_date: this.reserve_date
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

            collection.find({owner: name}).toArray(function (err, docs) {
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
