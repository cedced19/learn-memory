 module.exports = function (req, res, configPath, cb) {
  var credentials = require('basic-auth')(req);
  
  if (!credentials || credentials.name !== require(configPath).user || credentials.pass !== require(configPath).password) {
    res.writeHead(401, {
      'WWW-Authenticate': 'Basic realm="You need a username and a password."'
    });
    res.end();
    return;
  } else {
    cb();
    return;
  }
};