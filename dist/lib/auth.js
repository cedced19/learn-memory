#!/usr/bin/env node
'use strict'; 
module.exports = function (req, res, configPath, cb) {
  var credentials = require('basic-auth')(req);
  var check = function () {
      if (!credentials) return false;
      for(var user in  require(configPath).users) {
          if (credentials.name == require(configPath).users[user].name && credentials.pass == require(configPath).users[user].password) {
              return true;
          }
      }
      return false;
  };
     
  if (check()) {
    cb();
    return;
  } else {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="You need a username and a password."'
    });
    res.end();
    return;
  }
};