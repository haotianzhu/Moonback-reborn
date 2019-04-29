
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 11;


var userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    modifyDate: { type: Date, default: Date.now },
});

userSchema.statics.execute = (query, callback) => {
    return this.find(query.select).skip(query.skip).limit(query.limit).sort(query.sort).exec(callback)
};

UsersSchema.methods.setPassword = (password) => {
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    this.password = bcrypt.hashSync(password, salt);
};

serSchema.methods.validatePassword = (candidatePassword, callback) => {
    bcrypt.compareSync(candidatePassword, this.password, (error, isMatch) => {
        if (error) return callback(error);
        callback(null, isMatch);
    });
}

//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
userSchema.pre('save', (next) => {
    var user = this;
    await user.setPassword(user.password);
    next();
});

userSchema.methods.comparePassword = (candidatePassword, callback) => {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('user', userSchema, 'users');
