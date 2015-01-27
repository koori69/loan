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