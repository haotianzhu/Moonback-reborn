var assert = require('assert');
const User = require('../models/user');
var mongoose = require('mongoose');
var testdb = 'mongodb://localhost:27017/moonback_test_db';


describe('User Model', () => {
    describe('#Password is encrypted', () => {
        // connect to db
        mongoose.connect(testdb, { useNewUrlParser: true }, error => {
            if (error) {
                console.error(error)
            } else {
                console.log("connected")
            }
        })

        it('password should not equal to "a_naive_passwordXD" ', () => {
            // find fakeTester, if exists, compare its password in db and its true password
            User.findOne({ username: 'fakeTester' }, (error, user) => {
                if (error) assert.ok(false);
                if (user) {
                    assert.notEqual(user.password, 'a_naive_passwordXD');
                } else {
                    // if no such user, insert a new document
                    var fakeTester = new User({ username: 'fakeTester', password: 'a_naive_passwordXD' });

                    fakeTester.save( (err) => {
                        if (err) assert.ok(false);
                    });
                    User.findOne({ username: 'fakeTester' }, (error, newUser) => {
                        if (error) assert.ok(false);
                        if (user) {
                            assert.notEqual(user.password, 'a_naive_passwordXD');
                        } else {
                            assert.ok(false);
                        }
                    });
                }
            });

        });
        mongoose.connection.close()
    });
});


