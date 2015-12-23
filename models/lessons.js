var Waterline = require('waterline');

var Lessons = Waterline.Collection.extend({
    identity: 'lessons',
    connection: 'save',

    attributes: {
        content: 'string',
        substance: 'string'
    }
});

module.exports = Lessons;
