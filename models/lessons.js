var Waterline = require('waterline');

var Lessons = Waterline.Collection.extend({
    identity: 'lessons',
    connection: 'mongo',

    attributes: {
        content: 'string',
        substance: 'string',
        attachments: 'array'
    }
});

module.exports = Lessons;
