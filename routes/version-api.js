var express = require('express');
var router = express.Router();
var pkg = require('../package.json');
var checkUpdate = require('check-update');
var auth = require('../policies/auth.js');
var semver = require('semver');

/* GET Version */
router.get('/', auth, function(req, res, next) {
    checkUpdate({packageName: pkg.name}, function(err, latestVersion){
      if(err) return next(err);
      var update = false;
      if (semver.lt(pkg.version, latestVersion)) {
        update = true;
      }
      res.json({
          local: pkg.version,
          last: latestVersion,
          update: update,
          url: pkg.homepage + '/releases/latest'
      });
    });
});

module.exports = router;
