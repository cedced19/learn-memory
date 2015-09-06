var Waterline = require('waterline');
var hash = require('password-hash');

var format = function(user, cb) {
    if (user.password) {
        user.password = hash.generate(user.password);
    };

    cb();
}

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
