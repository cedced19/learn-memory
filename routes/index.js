var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET Home page */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.render('index', {});
    } else {
        req.app.models.users.find().exec(function (err, model) {
          if(err) return res.status(500).json({ err : err });
          if (model.length == 0) {
              res.render('signup', {});
          } else {
              res.render('index', {});
          }
        });
    }
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.cookie('learn-memory-user', JSON.stringify(req.user));
    res.json(req.user);
});

router.post('/signup', function(req, res, next) {
    req.app.models.users.find().exec(function (err, model) {
        if(err) return res.status(500).json({ err : err });
        if (model.length == 0) {
            req.app.models.users.create(req.body, function(err, model) {
                if(err) return res.status(500).json({ err : err });
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
      });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.cookie('learn-memory-user', false);
    res.redirect('/');
});

module.exports = router;
