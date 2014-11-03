var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '首页'});
});

router.get('/reg', function(req, res) {
  res.render('reg', { title: '用户注册'});
});

router.post('/reg', function(req, res) {
    //檢驗用戶兩次輸入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
      req.flash('error', '两次输入的密码不一致，请重新输入。');
      return res.redirect('/reg');
    }

    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
      name: req.body.username,
      password: password
    });

    //檢查用戶名是否已經存在
    User.get(newUser.name, function(err, user) {
      if (user)
        err = 'Username already exists.';
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      //如果不存在則新增用戶
      newUser.save(function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        req.session.user = newUser;
        req.flash('success', '注册成功');
        res.redirect('/');
      });
    });
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


