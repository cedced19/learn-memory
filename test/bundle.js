var request = require('supertest');
var expect = require('chai').expect;
var build = require('../build/prod');

process.env.NODE_ENV = 'production';
var app = require('../app');

describe('Test creation of bundle', function () {
    it('should create /public/javascripts/scripts.js', function () {
      build();
    });
});


describe('Test javascript file', function () {
    it('responds to /javascripts/scripts.js', function (done) {
      request(app)
        .get('/javascripts/scripts.js')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});
