var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
const jwt = require('jsonwebtoken')

var userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
    token: { type: String, default: ""},
});

userSchema.statics.toAuthJSON = function (user) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 30);

    const token = jwt.sign({
        username: user.username,
        id: user._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');

    const userJson = {
        id: user._id,
        username: user.username,
        token: token,
    };

    return userJson
};

userSchema.statics.execute = function (query, callback) {
    return this.find(query.select).skip(query.skip).limit(query.limit).sort(query.sort).exec(callback)
};

userSchema.statics.validatePassword = function (userPassword, candidatePassword, callback) {
    bcrypt.compare(candidatePassword, userPassword, (error, isMatch) => {
        if (error) return callback(error);
        callback(null, isMatch);
    });
}

//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
userSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // hash the password along with our new salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('user', userSchema, 'users');
