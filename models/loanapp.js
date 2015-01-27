/**
 * Created by lambert on 15/1/26.
 */
var mongodb = require("./db");

function LoanApp(loanApp) {
    this.userName = loanApp.userName;
    this.sex = loanApp.sex;
    this.age = loanApp.age;
    this.marriage = loanApp.marriage;
    this.mobile = loanApp.mobile;
    this.presentAddress = loanApp.presentAddress;
    this.idNumber = loanApp.idNumber;
    this.loanLimit = loanApp.loanLimit;
    this.loanDate = loanApp.loanDate;
}

LoanApp.getAll = function getAll(callback) {
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