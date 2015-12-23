var assert = require('assert');
var expect = require('chai').expect;
var Waterline = require('waterline');
var memoryAdapter = require('sails-memory');

suite('Test models', function () {
    var waterline = new Waterline();
    var config = {
        adapters: {
            'default': memoryAdapter,
            memory: memoryAdapter
        },
        connections: {
            save: {
                adapter: 'memory'
            }
        },
        defaults: {
            migrate: 'safe'
        }
    };


    setup(function (done) {
        waterline.loadCollection(require('../models/users.js'));
        waterline.loadCollection(require('../models/registrants.js'));
        waterline.loadCollection(require('../models/lessons.js'));
        waterline.initialize(config, function  (err, ontology) {
            if (err) {
                return done(err);
            }
            done();
        });
    });

    teardown(function () {
        var adapters = config.adapters || {};
        var promises = [];

        Object.keys(adapters)
            .forEach(function (adapter) {
                if (adapters[adapter].teardown) {
                    var promise = new Promise(function (resolve) {
                        adapters[adapter].teardown(null, resolve);
                    });
                    promises.push(promise);
                }
            });

        return Promise.all(promises);
    });

    test('should be able to create a user', function () {
        var Users = waterline.collections.users;

            return Users.create({
                name: 'Cédric',
                password: '123456'
            })
            .then(function (user) {
                assert.equal(user.name, 'Cédric', 'should have set the name');
                assert.notEqual(user.password, '123456', 'should have hash the password');
            });
    });

    test('should be able to create a registrant', function () {
        var Registrants = waterline.collections.registrants;

            return Registrants.create({
                name: 'Cédric',
                password: '123456'
            })
            .then(function (registrant) {
                assert.equal(registrant.name, 'Cédric', 'should have set the name');
                assert.equal(registrant.password, '123456', 'should haven\'t hash the password');
            });
    });

    test('should be able to create a lesson', function () {
        var Lessons = waterline.collections.lessons;

            return Lessons.create({
                substance: 'Maths',
                content: '2+2=4'
            })
            .then(function (lesson) {
                assert.equal(lesson.substance, 'Maths', 'should have set the substance');
                assert.equal(lesson.content, '2+2=4', 'should have set the content');
                expect(lesson.id).to.be.an('number');
                expect(lesson.updatedAt).to.be.a('date');
                expect(lesson.createdAt).to.be.a('date');
            });
    });


});
