process.env.NODE_ENV = 'production';

var request = require('supertest');
var expect = require('chai').expect;
var build = require('../build/prod');
var app = require('../app');

describe('Test creation of the bundles', function () {

    before(function() {
      build();
    });

    it('should respond to /javascripts/scripts.js', function (done) {
      request(app)
        .get('/javascripts/scripts.js')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });

    it('should respond to /stylesheets/styles.css', function (done) {
      request(app)
        .get('/stylesheets/styles.css')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});
