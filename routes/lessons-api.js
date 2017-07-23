var express = require('express');
var router = express.Router();
var auth = require('../policies/auth.js');

/* GET Lessons */
router.get('/', function(req, res, next) {
    var format = function(err, models) {
        if(err) return next(err);
        models.forEach(function(item) {
            item.keywords = item.content
                    .replace(/&#39;/gi, '\'')
                    .replace(/\n/gi, ' ')
                    .replace(/<.[^>]*>/gi, '')
                    .replace(/&quot/gi, '"')
                    .substring(0, 100);

            if (typeof req.query.createdAt == 'undefined') {
              delete item.createdAt;
            }

            if (typeof req.query.content == 'undefined') {
              delete item.content;
            }

            if (typeof req.query.attachments == 'undefined') {
              delete item.attachments;
            }

        });
        res.json(models);
    };


    if (req.query.page) {
      req.app.models.lessons.find({
        limit: (req.query.limit || 30),
        skip: 30 * (req.query.page-1),
        sort: { id: 'desc' }
      }).exec(format);
    } else {
      req.app.models.lessons.find().exec(format);
    }
});

router.get('/long', function(req, res, next) {
    res.redirect(301, '/api?createdAt&content&attachments');
});

router.post('/', auth, function(req, res, next) {
    req.app.models.lessons.create(req.body, function(err, model) {
        if(err) return next(err);
        res.json(model);
    });
});

router.get('/:id', function(req, res, next) {
    req.app.models.lessons.findOne({ id: req.params.id }, function(err, model) {
        if(err) return next(err);
        if(model === '' || model === null || model === undefined) return next(err);
        res.json(model);
    });
});

router.delete('/:id', auth, function(req, res, next) {
    req.app.models.lessons.destroy({ id: req.params.id }, function(err) {
        if(err) return next(err);
        res.json({ status: true });
    });
});

router.put('/:id', auth, function(req, res, next) {
    delete req.body.id;
    req.app.models.lessons.update({ id: req.params.id }, req.body, function(err, model) {
        if(err) return next(err);
        res.json(model[0]);
    });
});

module.exports = router;
