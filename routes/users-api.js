var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');
var hash = require('password-hash-and-salt');

/* GET Users */
router.get('/', auth, function(req, res, next) {
    req.app.models.users.find().exec(function(err, models) {
        if(err) return next(err);
        models.forEach(function(model){
            delete model.password;
        });
        res.json(models);
    });
});

/* POST Users: create a user */
router.post('/', auth, function(req, res, next) {
    req.app.models.users.create(req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

/* GET User */
router.get('/:id', auth, function(req, res, next) {
    req.app.models.users.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        delete model.password;
        res.json(model);
    });
});

/* DELETE User */
router.delete('/:id', auth, function(req, res, next) {
    req.app.models.users.destroy({ id: req.params.id }, function(err) {
        if(err) return next(err);
        res.json({ status: true });
    });
});

/* PUT User */
router.put('/:id', auth, function(req, res, next) {
    delete req.body.id;
    // Test old password
    req.app.models.users.findOne({ name: req.body.name }, function (err, model) {
      if (err) { return next(err); }
      if (!model) {
        return next(new Error('User not found.'));
      }

      hash(req.body.oldpassword).verifyAgainst(model.password, function(err, verified) {
          if(err) {
            return next(err);
          } else if (!verified) {
            err = new Error('Old password does not match.');
            err.status = 401;
            return next(err);
          } else {
          req.app.models.users.update({ id: req.params.id }, {
            name: req.body.namestart,
            password : req.body.password
          }, function(err, model) {
                if(err) return next(err);
                delete model[0].password;
                res.json(model[0]);
            });
          }
      });

    });

});

module.exports = router;
