var express = require('express');
var router = express.Router();
var pkg = require('../package.json');
var got = require('got');

/* GET Version */
router.get('/', function(req, res, next) {
    got('https://raw.githubusercontent.com/cedced19/learn-memory/master/package.json', function (err, data) {
        if(err) return next(err);
        data = JSON.parse(data);
        res.json({
            local: pkg.version,
            github: data.version,
            url: 'https://github.com/cedced19/listodo/releases/latest'
        });
    });
});

module.exports = router;
