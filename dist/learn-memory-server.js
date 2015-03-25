#!/usr/bin/env node
'use strict';
var   app = require('express')(),
        serveStatic = require('serve-static'),
        path = require('path'),
        fs = require('fs'),
        auth = require('./lib/auth.js'),
        Waterline = require('waterline'),
        diskAdapter = require('sails-disk'),
        bodyParser = require('body-parser'),
        configPath = process.cwd() + '/config.json',
        pkg = require('./package.json'),
        colors = require('colors');

fs.exists(configPath, function(exists) {
           if(!exists) {
                var config = {
                    users: [
                        {
                         name: '',
                         password: ''
                        }
                    ],
                    port:7772
                };
                fs.writeFileSync(configPath, JSON.stringify(config));
                console.log(colors.red('You must config this software in config.json.'));
                process.exit(0);
           }
           if (require(configPath).users[0].name === '' || require(configPath).users[0].password === ''){
                console.log(colors.red('You must change the user and the password in config.json.'));
                process.exit(0);
           }
});


var orm = new Waterline();

var config = {
  adapters: {
    'default': diskAdapter,
    disk: diskAdapter
  },
  connections: {
      save: {
          adapter: 'disk',
          filePath: ''
      },
  },
  defaults: {
    migrate: 'alter'
  }
};

var Lesson = Waterline.Collection.extend({

  identity: 'lesson',
  connection: 'save',

  attributes: {
     content: 'string',
     substance: 'string'
  }
});

orm.loadCollection(Lesson);

app.get('/config.json', function(req, res) {
  res.redirect(302, '/');
});

app.use(serveStatic(__dirname));
app.use(bodyParser.json());

app.get('/api', function(req, res) {
  app.models.lesson.find().exec(function(err, models) {
    if(err) return res.status(500).json({ err : err});
    // Don't download useless data
    models.forEach(function(item){
        item.content = item.content
        .replace(new RegExp('&#39;', 'gi'), '\'')
        .replace(new RegExp('\n', 'gi'), ' ')
        .replace(new RegExp('<.[^>]*>', 'gi' ), '')
        .replace(new RegExp('&quot;', 'gi'), '"');
        item.content = item.content.substring(0,100);
        delete item.createdAt;
    });
    res.json(models);
  });
});

app.get('/api/long', function(req, res) {
  app.models.lesson.find().exec(function(err, models) {
    if(err) return res.status(500).json({ err : err});
    // Don't download useless data
    models.forEach(function(item){
        item.content = item.content
        .replace(new RegExp('&#39;', 'gi'), '\'')
        .replace(new RegExp('\n', 'gi'), ' ')
        .replace(new RegExp('<.[^>]*>', 'gi' ), '')
        .replace(new RegExp('&quot;', 'gi'), '"');
    });
    res.json(models);
  });
});

app.post('/api', function(req, res) {
  auth(req, res, configPath, function () {
      app.models.lesson.create(req.body, function(err, model) {
        if(err) return res.status(500).json({ err : err});
        res.json(model);
    });
  });
});

app.get('/api/:id', function(req, res) {
  app.models.lesson.findOne({ id: req.params.id }, function(err, model) {
    if(err) return res.status(500).json({ err : err});
    if(model === '' || model === null) return res.status(404).json({ err: 404 });
    res.json(model);
  });
});

app.delete('/api/:id', function(req, res) {
    auth(req, res, configPath, function () {
      app.models.lesson.destroy({ id: req.params.id }, function(err) {
        if(err) return res.status(500).json({ err : err});
        res.json({ status: 'ok' });
    });
  });
});

app.put('/api/:id', function(req, res) {
 auth(req, res, configPath, function () {		
    delete req.body.id;		
    app.models.lesson.update({ id: req.params.id }, req.body, function(err, model) {		
      if(err) return res.json({ err: err }, 500);		
      res.json(model);		
    });		
  });		
});

app.get('*', function(req, res){
  res.status(404).json({ err: 404 });
});

orm.initialize(config, function(err, models) {
  if(err) throw err;
  require('check-update')({packageName: pkg.name, packageVersion: pkg.version, isCLI: true}, function(err, latestVersion, defaultMessage){
       if(!err){
            console.log(defaultMessage);
       }
  });
  var port = require(configPath).port;
  app.models = models.collections;
  app.connections = models.connections;
  app.listen(port);
  console.log('Server running at\n  => '+ colors.green('http://localhost:'+ port) + '\nCTRL + C to shutdown');
});