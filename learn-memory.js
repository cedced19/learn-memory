#!/usr/bin/env node
"use strict";
var   express = require("express"),
        app = express(),
        serveStatic = require("serve-static"),
        path = require("path"),
        fs = require("fs"),
        program = require("commander"),
        Waterline = require('waterline'),
        diskAdapter = require('sails-disk'),
        bodyParser = require("body-parser"),
        chalk = require("chalk");

program
  .version(require("./package.json").version)
  .option("-p, --port [number]", "specified the port")
  .parse(process.argv);

var orm = new Waterline();

var config = {
  adapters: {
    'default': diskAdapter,
    disk: diskAdapter
  },
  connections: {
      save: {
          adapter: 'disk'
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
     substance: 'string',
     markdown: 'string'
  }
});

orm.loadCollection(Lesson);

app.use(serveStatic(__dirname));
app.use(bodyParser.json());

app.get('/api', function(req, res) {
  app.models.lesson.find().exec(function(err, models) {
    if(err) return res.json({ err: err }, 500);
    // Don't download useless data
    for (var key in models){
        models[key].content = models[key].content.replace(new RegExp('\n', 'gi'), ' ').replace(new RegExp('&#39;', 'gi'), '\'').replace(new RegExp('\n', 'gi'), ' ').replace(new RegExp('<.[^>]*>', 'gi' ), '');
        delete models[key].markdown;
    }
    res.json(models);
  });
});

app.post('/api', function(req, res) {
  app.models.lesson.create(req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

app.get('/api/:id', function(req, res) {
  app.models.lesson.findOne({ id: req.params.id }, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

app.delete('/api/:id', function(req, res) {
  app.models.lesson.destroy({ id: req.params.id }, function(err) {
    if(err) return res.json({ err: err }, 500);
    res.json({ status: 'ok' });
  });
});

app.put('/api/:id', function(req, res) {
  delete req.body.id;

  app.models.lesson.update({ id: req.params.id }, req.body, function(err, model) {
    if(err) return res.json({ err: err }, 500);
    res.json(model);
  });
});

orm.initialize(config, function(err, models) {
  if(err) throw err;
  var port;
  if (!isNaN(parseFloat(program.port)) && isFinite(program.port)){
      port = program.port;
  }else{
      port = 7772;
  }
  app.models = models.collections;
  app.connections = models.connections;
  app.listen(port);
  console.log("Server running at\n  => "+ chalk.green("http://localhost:"+ port) + "\nCTRL + C to shutdown");
});