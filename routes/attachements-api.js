var express = require('express');
var router = express.Router();
var mime = require('mime');
var path = require('path');
var fs = require('fs');
var existsFile = require('exists-file');

/* GET All Attachements */
router.get('/', function(req, res, next) {
  fs.readdir(path.resolve(__dirname, '../attachements/'), function (err, files) {
    if(err) return next(err);
    res.json(files.filter((file)=>file!='.gitkeep'));
  });
});

/* GET Attachement */
router.get('/:id', function(req, res, next) {
    var p = path.resolve(__dirname, '../attachements/', req.params.id);
    existsFile(p, function (err, exists) {
      if (err || !exists) {
        err = new Error('File doesn\'t exist.');
        err.status = 500;
        return next(err);
      }
      res.setHeader('Content-Type', mime.lookup(p));
      res.setHeader('Content-Disposition', 'attachment filename=' + req.params.id);
      fs.createReadStream(p).pipe(res);
    });
});

module.exports = router;
