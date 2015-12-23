var Waterline = require('waterline');
var hash = require('password-hash-and-salt');

var format = function(user, cb) {
  if (user.password) {
      hash(user.password).hash(function(err, crypted) {
        if (err) return cb(err);
        user.password = crypted;
        cb();
      });
  } else {
    cb();
  }
};

var Users = Waterline.Collection.extend({
    identity: 'users',
    connection: 'save',
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
        name: 'string',
        password:  'string'
    },

    beforeCreate: format,
    beforeUpdate: format
});

module.exports = Users;
