var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET Home page */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('index', {});
    } else {
        req.app.models.users.find().exec(function (err, model) {
          if(err) return next(err);
          if (model.length === 0) {
              res.render('signup');
          } else {
              res.render('index');
          }
        });
    }
});

router.get('/authenticated', function(req, res) {
    if (req.isAuthenticated()) {
      res.json({
        status: true,
        user: req.user
      });
    } else {
      res.json({ status: false });
    }
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    if (req.xhr) {
        res.json(req.user);
    } else {
        res.redirect('/');
    }
});

router.post('/signup', function(req, res, next) {
    req.app.models.users.find().exec(function (err, model) {
        if(err) return next(err);
        if (model.length === 0) {
            req.app.models.users.create(req.body, function(err, model) {
                if(err) return next(err);
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
      });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
