var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express'});
});

//router.get('/u/:user', function(req, res) {
//  res.render('index', { title: user });
//});
//exports.user = function(req, res) {
//
//};
//
//exports.post = function(req, res) {
//
//};
//
//exports.reg = function(req, res) {
//
//};
//
//exports.doReg = function(req, res) {
//
//};
//
//exports.login = function(req, res) {
//
//};
//
//exports.doLogin = function (req, res) {
//
//};
//
//exports.logout = function (req, res) {
//
//};

module.exports = router;


