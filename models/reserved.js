/**
 * Created by lambert on 14/11/16.
 */
var mongodb = require("./db");

function Reserved(reser) {
    this.account = reser.account;
    this.amount = reser.amount;
}

module.exports = Reserved;

Reserved.prototype.set = function set(callback) {
    var reserved = {
        amount: this.amount,
        account: this.account
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }

        console.log("Reserved, Open MongoDB succeed.");
        db.collection("reserved", function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
//            collection.ensureIndex
            console.log("Open collection succeed.");
            collection.insert(reserved, {safe: true}, function(err, rese) {
                mongodb.close();
                callback(err, rese);
            });
        });
    });
};