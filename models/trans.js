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

//if (typeof transType == "undefined") {
//    var transType = {};
//    transType.IN = "IN";
//    transType.OUT = "OUT";
//}

module.exports = Trans;

Trans.prototype.save = function save(callback) {
    var trans = {
        funder: this.funder,
        type: this.type,
        amount: this.amount,
        date: this.date
    };

    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        // TODO: how is the pool in MongoDB designed
        /*
        1. total amount
        2. every one's amount
        3. amount change list(in and out)
        4. records like:
        利息是怎么产生的，怎么进来？自动的还是手动添加？自动产生需不需要进来的时候就谈好利率？
        储备金是多少？直接给个界面设置就行

        总的资金以饼图展示
        总的利息也可以以饼图展示
        约定抽出时间快到了可以搞个提示

//         */
//        template = {
//            "funder": "孙权",
//            "amount": 10000,
//            "in_date": "2014/11/06",
//            "out_reserved": Yes,
//            "out_date": null
//        };
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