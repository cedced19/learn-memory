var Waterline = require('waterline');

var Registrants = Waterline.Collection.extend({
    identity: 'registrants',
    connection: 'mongo',
    autoCreatedAt: false,
    autoUpdatedAt: false,

    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        }
    }
});

module.exports = Registrants;
