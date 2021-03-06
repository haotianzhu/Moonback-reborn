const mongoose = require('mongoose')
const Schema = mongoose.Schema
var bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10
const jwt = require('jsonwebtoken')

var userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true, default: '' },
  isActivated: { type: Boolean, default: false, required: true },
  createDate: { type: Date, default: Date.now },
  modifyDate: { type: Date, default: Date.now },
  token: { type: String, default: '' },
  echart: { type: Object, default: { anime: 10, level: 10, game: 10, manga: 10, novel: 10 } }
})

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
})

userSchema.statics.toAuthJSON = function (user, isGenerateToken) {
  var token = null
  const today = new Date()
  if (isGenerateToken) {
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 30)

    token = jwt.sign({
      username: user.username,
      id: user.id,
      isActivated: user.isActivated,
      email: user.email,
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    }, 'moonback-reborn-secrete')
  }
  user.token = token || user.token
  user.modifyDate = today
  return user
}

// email verification
userSchema.statics.execute = function (query, callback) {
  return this.find(query.select).skip(query.skip).limit(query.limit).sort(query.sort).exec(callback)
}

userSchema.statics.execute = function (query, callback) {
  return this.find(query.select).skip(query.skip).limit(query.limit).sort(query.sort).exec(callback)
}

userSchema.statics.validatePassword = function (userPassword, candidatePassword, callback) {
  bcrypt.compare(candidatePassword, userPassword, (error, isMatch) => {
    if (error) return callback(error)
    callback(null, isMatch)
  })
}

userSchema.statics.generateHashPassword = function (password, callback) {
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return callback(err)
    // hash the password along with our new salt
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) return callback(err)
      // override the cleartext password with the hashed one
      return callback(null, hash)
    })
  })
}

// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
userSchema.pre('save', function (next) {
  var user = this
  user.modifyDate = Date.now()
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  // hash the password along with our new salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

module.exports = mongoose.model('user', userSchema, 'users')
