/**
 * Created by lambert on 14/11/6.
 */
var mongodb = require("./db");

function Pool(pool) {
    this.total = pool.total;
}

module.exports = Pool;

Pool.getByFunder = function (funderName, callback) {
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

         */
        template = {
            "funder": "孙权",
            "amount": 10000,
            "revenue_rate": 0.3,
            "revenue_cycle": monthly,
            "in_date": "2014/11/06",
            "out_reserved": Yes,
            "out_date": null
        };
        db.collection();
    });
};