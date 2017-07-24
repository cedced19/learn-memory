var express = require('express');
var router = express.Router();
var mime = require('mime');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var randomstring = require('randomstring');
var auth = require('../policies/auth.js');

/* GET All Attachements */
router.get('/', function(req, res, next) {
  fs.readdir(path.resolve(__dirname, '../attachments/'), function (err, files) {
    if(err) return next(err);
    res.json(files.filter((file)=>file!='.gitkeep'));
  });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '../attachments/'));
  },
  filename: function (req, file, cb) {
    cb(null, randomstring.generate(8) + '.' + mime.extension(file.mimetype));
  }
});

var upload = multer({ storage: storage });

/* POST Upload new attachement */
router.post('/', auth, upload.single('file'), function(req, res, next) {
      if (req.file === undefined) {
        err = new Error('You must upload a file.');
        err.status = 400;
        return next(err);
      }
      req.app.models.lessons.findOne({ id: req.body.lesson_id }, function(err, model) {
          if(err) return next(err);
          if(model === '' || model === null || model === undefined) return next(err);
          if(typeof model.attachments == 'undefined') model.attachments = [];
          model.attachments.push(req.file.filename);
          req.app.models.lessons.update({ id: req.body.lesson_id }, model, function(err, model) {
              if(err) return next(err);
              res.json({
                filename: req.file.filename
              });
          });
      });
});

/* DELETE Remove an attachement */
router.delete('/:lesson_id/:id', auth, function(req, res, next) {
      fs.unlink(path.resolve(__dirname, '../attachments/', req.params.id), function (err) {
        if (err) return next(err);
        req.app.models.lessons.findOne({ id: req.params.lesson_id }, function(err, model) {
            if(err) return next(err);
            if(model === '' || model === null || model === undefined) return next(err);
            if(typeof model.attachments == 'undefined') {
              err = new Error('No attachment with this lesson.');
              err.status = 400;
              return next(err);
            }
            var index = model.attachments.indexOf(req.params.id);
            if (index === -1) {
              err = new Error('Attachment already deleted.');
              err.status = 400;
              return next(err);
            }
            model.attachments.splice(index, 1);
            req.app.models.lessons.update({ id: req.params.lesson_id }, model, function(err, model) {
                if(err) return next(err);
                res.json({ status: true });
            });
        });
      });
});

module.exports = router;
