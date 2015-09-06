var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET Users */
router.get('/', function(req, res, next) {
    req.app.models.users.find().exec(function(err, models) {
        if(err) return next(err);
        models.forEach(function(model){
            delete model.password;
        });
        res.json(models);
    });
});

router.post('/', auth, function(req, res, next) {
    req.app.models.users.create(req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

router.get('/:id', function(req, res, next) {
    req.app.models.users.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        delete model.password;
        res.json(model);
    });
});

router.delete('/:id', auth, function(req, res, next) {
    req.app.models.users.destroy({ id: req.params.id }, function(err) {
        if(err) return next(err);
        res.json({ status: 'ok' });
    });
});

router.put('/:id', auth, function(req, res, next) {
    delete req.body.id;
    req.app.models.users.update({ id: req.params.id }, req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

module.exports = router;