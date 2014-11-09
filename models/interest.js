/**
 * Created by lambert on 14/11/9.
 */
var mongodb = require("./db");

function Withdraw(wd) {
    this.funder = wd.funder;
    this.type = wd.type; // in or out
    this.amount = wd.amount;
    this.date = wd.date;
}

if (typeof transType == "undefined") {
    var transType = {};
    transType.IN = "IN";
    transType.OUT = "OUT";
}

module.exports = Trans;