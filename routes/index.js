var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user.js');
var Trans = require("../models/trans.js");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '首页'});
});

//router.post('/reg', checkNotLogin);
//router.get('/reg', function(req, res) {
//  res.render('reg', { title: '用户注册'});
//});

//router.post('/reg', checkNotLogin);
//router.post('/reg', function(req, res) {
//    //檢驗用戶兩次輸入的口令是否一致
//    if (req.body['password-repeat'] != req.body['password']) {
//      req.flash('error', '两次输入的密码不一致，请重新输入。');
//      return res.redirect('/reg');
//    }
//
//    //生成口令的散列值
//    var md5 = crypto.createHash('md5');
//    var password = md5.update(req.body.password).digest('base64');
//
//    var newUser = new User({
//      name: req.body.username,
//      password: password
//    });
//
//    //檢查用戶名是否已經存在
//    User.get(newUser.name, function(err, user) {
//      if (user)
//        err = 'Username already exists.';
//      if (err) {
//        req.flash('error', err);
//        return res.redirect('/reg');
//      }
//      //如果不存在則新增用戶
//      newUser.save(function(err) {
//        if (err) {
//          req.flash('error', err);
//          return res.redirect('/reg');
//        }
//        req.session.user = newUser;
//        req.flash('success', '注册成功');
//        res.redirect('/');
//      });
//    });
//  });

  router.get('/login', checkNotLogin);
  router.get('/login', function(req, res) {
    res.render('login', {
      title: '用户登录'
    });
  });

  router.post('/login', checkNotLogin);
  router.post('/login', function(req, res) {
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '密码错误');
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登录成功');
      res.redirect('/');
    });
  });

  router.get('/logout', checkLogin);
  router.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
  });

router.get('/pool', checkLogin);
router.get('/pool', function(req, res) {
    function TestData(data) {
        this.name = data.name;
        this.value = data.value;
    }

    var testdata = new TestData({
        name: "孙权",
        value: 80
    });

    console.log(testdata);
    res.render('pool', {
        title: '资金池',
        data: testdata
    });
});

  router.get('/pool_insert', checkLogin);
  router.get('/pool_insert', function(req, res) {
    res.render('pool_insert', {
      title: '资金池-注入'
    });
  });

router.get('/pool_insert', checkLogin);
router.post("/pool_insert", function (req, res) {
    if (!req.body.funder) {
        req.flash("error", "出资人不能为空");
        return res.redirect("/pool_insert");
    }
    if (!req.body.amount) {
        req.flash("error", "金额不能为空");
        return res.redirect("/pool_insert");
    }
    if (!req.body.in_date) { // default should set to current time
        req.flash("error", "出资时间不能为空");
        return res.redirect("/pool_insert");
    }
    if (req.body.out_reserved == "是" && !req.body.out_date) {
        req.flash("error", "约定抽出日期不能为空");
        return res.redirect("/pool_insert");
    }

    console.log("All body verified.");
    var newTrans = new Trans ({
        funder: req.body.funder,
        type: "IN",
        amount: req.body.amount,
        date: req.body.in_date
    });

    console.log(newTrans);
    console.log("Start to push to MongoDB.");
    newTrans.save(function(err) {
        if (err) {
            console.log("Save trans error.");
            req.flash("error", "注入失败");
            return res.redirect("/pool_insert");
        }
        req.flash("success", "注入成功");
        return res.redirect("/pool_insert");
    });
});

  router.get('/detailed', checkLogin);
  router.get('/detailed', function(req, res) {
    res.render('detailed', {
      title: '借款明细'
    });
  });

  router.get('/borrower', checkLogin);
  router.get('/borrower', function(req, res) {
    res.render('borrower', {
      title: '借款人'
    });
  });

  router.get('/pawn', checkLogin);
  router.get('/pawn', function(req, res) {
    res.render('pawn', {
      title: '抵押物'
    });
  });

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录');
    return res.redirect('/');
  }
  next();
}
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


