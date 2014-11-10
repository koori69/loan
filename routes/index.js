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
    Trans.getAll(function(err, allDoc) {
        totalFund = summaries(allDoc);
        res.render('pool', {
            title: '资金池',
            fund: totalFund
        });
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
    console.log(req.body);
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
        owner: req.body.funder,
        type: "IN",
        amount: req.body.amount,
        date: req.body.in_date,
        reserved: req.body.out_reserved,
        reserved_date: req.body.out_date,
        fee: req.body.interest
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

router.get('/pool_withdraw', checkLogin);
router.get('/pool_withdraw', function(req, res) {
    res.render('pool_withdraw', {
        title: '资金池-提取'
    });
});

router.get('/pool_withdraw', checkLogin);
router.post("/pool_withdraw", function (req, res) {
    console.log(req.body);
    if (!req.body.withdrawer) {
        req.flash("error", "提取人不能为空");
        return res.redirect("/pool_withdraw");
    }
    if (!req.body.amount) {
        req.flash("error", "提取金额不能为空");
        return res.redirect("/pool_withdraw");
    }
    if (!req.body.withdraw_date) { // default should set to current time
        req.flash("error", "提取时间不能为空");
        return res.redirect("/pool_withdraw");
    }

    if (req.body.fund_type == "利息") {
        req.flash("error", "暂不支持提取利息");
        return res.redirect("/pool_withdraw");
    }
    // TODO: need to verify if withdraw amount is larger than
    Trans.getAll(function(err, allDoc) {
        console.log("start getAll in pool_withdraw");
        totalFund = summaries(allDoc);
        if (!totalFund[req.body.withdrawer]) {
            req.flash("error", "提取人不存在");
            return res.redirect("/pool_withdraw");
        } else if (totalFund[req.body.withdrawer] < Number(req.body.amount)) {
            req.flash("error", "余额不足");
            return res.redirect("/pool_withdraw");
        }
        console.log("All body verified.");
        var newTrans = new Trans ({
            owner: req.body.withdrawer,
            type: "OUT",
            amount: req.body.amount,
            date: req.body.withdraw_date,
            reserved: null,
            reserved_date: null,
            fee: null
        });

        console.log(newTrans);
        console.log("Start to push to MongoDB.");
        newTrans.save(function(err) {
            if (err) {
                console.log("Save trans error.");
                req.flash("error", "注入失败");
                return res.redirect("/pool_withdraw");
            }
            req.flash("success", "注入成功");
            return res.redirect("/pool_withdraw");
        });

    });
});

router.get('/pool_history', checkLogin);
router.get('/pool_history', function(req, res) {
    Trans.getAll(function (err, allDoc) {
        var in_history = new Array();
        var out_history = new Array();
        for (var index = 0; index < allDoc.length; index ++) {
            history = allDoc[index];
            if (history.type == "IN") {
                in_history.push(history);
            } else {
                out_history.push(history);
            }
        }
        console.log(in_history);
        console.log(out_history);
        res.render('pool_history', {
            title: '资金池-历史记录',
            fundin: in_history,
            fundout: out_history
        });
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

function summaries(transHistory) {
    var totalFund = {};
    for (var index = 0; index < transHistory.length; index ++) {
        history = transHistory[index];
        console.log(history);
        console.log(!totalFund[history["owner"]]);
        if (!totalFund[history["owner"]]) {
            totalFund[history["owner"]] = 0;
        }

        if (history["type"] == "IN") {
            totalFund[history["owner"]] += Number(history["amount"]);
        } else {
            totalFund[history["owner"]] -= Number(history["amount"]);
        }
    }
    console.log(totalFund);
    return totalFund;
}

module.exports = router;


